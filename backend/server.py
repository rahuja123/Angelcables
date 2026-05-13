from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import requests as req_lib
from io import BytesIO
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Header, HTTPException as FastAPIHTTPException

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Email config (optional — notifications are silently skipped if not configured)
SMTP_HOST     = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER     = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
NOTIFY_EMAIL  = os.environ.get("NOTIFY_EMAIL", "")
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

def _send_email(subject: str, body_html: str) -> None:
    if not all([SMTP_USER, SMTP_PASSWORD, NOTIFY_EMAIL]):
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = SMTP_USER
        msg["To"]      = NOTIFY_EMAIL
        msg.attach(MIMEText(body_html, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, NOTIFY_EMAIL, msg.as_string())
    except Exception as e:
        logger_email = logging.getLogger("email")
        logger_email.warning(f"Email notification failed: {e}")

def _contact_email_html(form_data: dict) -> str:
    return f"""
    <h2 style="color:#EA580C">New Contact Enquiry — Angel Cables</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px">
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Name</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('name')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Email</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('email')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Phone</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('phone') or '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Subject</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('subject') or '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Message</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('message')}</td></tr>
    </table>
    <p style="color:#64748b;font-size:12px;margin-top:16px">Sent from angelcables.com contact form</p>
    """

def _dealer_email_html(form_data: dict) -> str:
    return f"""
    <h2 style="color:#EA580C">New Dealer Enquiry — Angel Cables</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px">
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Name</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('name')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Company</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('company')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Phone</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('phone')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Email</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('email')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">City</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('city')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:bold">Message</td>
          <td style="padding:8px;border:1px solid #e2e8f0">{form_data.get('message') or '-'}</td></tr>
    </table>
    <p style="color:#64748b;font-size:12px;margin-top:16px">Sent from angelcables.com dealer enquiry form</p>
    """

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    features: List[str] = []
    image: str
    specs: dict = {}

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str

class DealerEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    phone: str
    email: str
    city: str
    message: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class DealerForm(BaseModel):
    name: str
    company: str
    phone: str
    email: str
    city: str
    message: str = ""

PRODUCTS_DATA = [
    # ── ARMOURED CABLE ──────────────────────────────────────────────────────────
    {
        "name": "2 Core Aluminium Armoured Cable",
        "category": "Armoured Cable",
        "description": "ISI-certified 2-core aluminium armoured cable for underground power distribution and outdoor feeder lines. Steel wire armour provides excellent mechanical protection against rodents, impact and soil pressure. Available in sizes 1.5 sq mm to 300 sq mm.",
        "features": ["ISI certified (IS 1554)", "Steel wire armour (SWA)", "PVC outer sheath", "Corrosion resistant", "Underground rated"],
        "image": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
        "specs": {"conductor": "Aluminium", "cores": "2", "voltage": "1.1 kV", "sizes": "1.5–300 sq mm", "standard": "IS 1554 Part 1"}
    },
    {
        "name": "3.5 Core Aluminium Armoured Cable",
        "category": "Armoured Cable",
        "description": "3.5-core aluminium armoured cable — the industry standard for 3-phase 4-wire distribution in industrial plants and sub-stations. The reduced neutral (0.5 core) meets IS 1554 requirements for unbalanced load systems. Available in sizes 16 sq mm to 300 sq mm.",
        "features": ["ISI certified (IS 1554)", "3-phase 4-wire system", "Reduced neutral conductor", "Steel wire armour", "Low voltage distribution"],
        "image": "https://productimages.withfloats.com/actual/68e49bf05c295f6c8beebf4e.jpg",
        "specs": {"conductor": "Aluminium", "cores": "3.5", "voltage": "1.1 kV", "sizes": "16–300 sq mm", "standard": "IS 1554 Part 1"}
    },
    {
        "name": "4 Core Aluminium Armoured Cable",
        "category": "Armoured Cable",
        "description": "4-core aluminium armoured cable for 3-phase plus full neutral power distribution. Widely used in commercial buildings, factories and underground power networks. Sizes from 1.5 sq mm to 300 sq mm.",
        "features": ["Full neutral conductor", "ISI certified", "SWA protection", "Flame retardant PVC", "Long service life"],
        "image": "https://productimages.withfloats.com/actual/68e4995b1a14f21bee4f1cc3.png",
        "specs": {"conductor": "Aluminium", "cores": "4", "voltage": "1.1 kV", "sizes": "1.5–300 sq mm", "standard": "IS 1554 Part 1"}
    },
    {
        "name": "2 Core Copper Armoured Cable",
        "category": "Armoured Cable",
        "description": "Premium 2-core copper armoured cable offering superior conductivity and mechanical protection. Preferred for critical power circuits, hospitals and data centres where copper conductivity is mandatory. Sizes 1.5 sq mm to 300 sq mm.",
        "features": ["Copper conductor", "Superior conductivity", "ISI certified", "Steel wire armour", "Fire resistant insulation"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"conductor": "Copper", "cores": "2", "voltage": "1.1 kV", "sizes": "1.5–300 sq mm", "standard": "IS 1554 Part 1"}
    },
    {
        "name": "4 Core Copper Armoured Cable",
        "category": "Armoured Cable",
        "description": "4-core copper armoured cable for the most demanding power distribution applications. Used in high-rise buildings, industrial plants and infrastructure projects where copper conductors are specified. Sizes 1.5 sq mm to 300 sq mm.",
        "features": ["Copper conductor", "4-core design", "SWA armoured", "PVC/XLPE insulation", "High mechanical strength"],
        "image": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
        "specs": {"conductor": "Copper", "cores": "4", "voltage": "1.1 kV", "sizes": "1.5–300 sq mm", "standard": "IS 1554 Part 1"}
    },
    # ── ELECTRIC HOUSE WIRE ─────────────────────────────────────────────────────
    {
        "name": "FR Single Core House Wire",
        "category": "Electric House Wire",
        "description": "ISI-marked FR (Flame Retardant) single-core copper house wire for standard residential and commercial wiring. Pure electrolytic copper conductor with FR-PVC insulation for enhanced fire safety. Available in 1.0, 1.5, 2.5, 4.0 and 6.0 sq mm.",
        "features": ["ISI marked (IS 694)", "Pure copper conductor", "FR-PVC insulation", "Self-extinguishing", "Smooth surface finish"],
        "image": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
        "specs": {"conductor": "Copper", "insulation": "FR-PVC", "voltage": "1.1 kV", "sizes": "1.0–6.0 sq mm", "standard": "IS 694"}
    },
    {
        "name": "FRLS Single Core House Wire",
        "category": "Electric House Wire",
        "description": "ISI-marked FRLS (Flame Retardant Low Smoke) single-core copper house wire. Mandatory in commercial buildings, hospitals, malls and public spaces as per NBC norms. Produces minimal toxic smoke during fire. Sizes 1.0 to 6.0 sq mm.",
        "features": ["ISI marked (IS 694)", "Low smoke emission", "Halogen-free option", "NBC compliant", "Superior fire safety"],
        "image": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
        "specs": {"conductor": "Copper", "insulation": "FRLS-PVC", "voltage": "1.1 kV", "sizes": "1.0–6.0 sq mm", "standard": "IS 694"}
    },
    {
        "name": "FR Multi-Strand Flexible House Wire",
        "category": "Electric House Wire",
        "description": "FR multi-strand flexible copper house wire for easy installation in conduit and surface wiring. The stranded construction makes it far easier to pull through conduit compared to solid wire, with no compromise on conductivity. Sizes 1.0 to 6.0 sq mm.",
        "features": ["Multi-strand copper", "Easy conduit pulling", "FR-PVC insulation", "ISI certified", "Kink resistant"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"conductor": "Stranded Copper", "insulation": "FR-PVC", "voltage": "1.1 kV", "sizes": "1.0–6.0 sq mm", "standard": "IS 694"}
    },
    {
        "name": "FRLS Multi-Strand Flexible House Wire",
        "category": "Electric House Wire",
        "description": "FRLS multi-strand flexible copper house wire combining easy installation with superior fire safety. Low smoke, self-extinguishing and ideal for offices, hospitals, schools and all commercial premises. Available in 0.5 sq mm to 6.0 sq mm.",
        "features": ["Low smoke & halogen", "Multi-strand flexible", "ISI marked", "Commercial grade", "Self-extinguishing"],
        "image": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
        "specs": {"conductor": "Stranded Copper", "insulation": "FRLS-PVC", "voltage": "1.1 kV", "sizes": "0.5–6.0 sq mm", "standard": "IS 694"}
    },
    {
        "name": "2.5 Sq.mm FR Copper Wire (Premium)",
        "category": "Electric House Wire",
        "description": "Our best-selling 2.5 sq mm FR copper wire — the correct size for 15A power points, AC connections and kitchen circuits as per IS 3043. Pure copper conductor with FR-PVC insulation for reliable protection. The most common size ordered by contractors and builders.",
        "features": ["ISI marked", "Correct 15A circuit size", "Pure copper", "FR-PVC insulated", "High demand stock item"],
        "image": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
        "specs": {"size": "2.5 sq mm", "conductor": "Copper", "insulation": "FR-PVC", "current_rating": "23A", "standard": "IS 694"}
    },
    # ── FLEXIBLE CABLE ──────────────────────────────────────────────────────────
    {
        "name": "Multi Core Control Flexible Cable",
        "category": "Flexible Cable",
        "description": "Multi-core copper flexible cables for control and instrumentation wiring in industrial panels, CNC machines and process control systems. Finely stranded copper conductors provide excellent flexibility for dynamic applications.",
        "features": ["Fine stranded copper", "Multi-core design", "Oil resistant sheath", "Flexible routing", "Panel wiring grade"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"conductor": "Copper", "cores": "2–24", "voltage": "1.1 kV", "type": "Flexible control", "standard": "IS 694"}
    },
    {
        "name": "Two Core Flexible Copper Cable",
        "category": "Flexible Cable",
        "description": "Two-core flexible copper cable for domestic appliances, extension cords and light commercial equipment. Available in 0.75, 1.0 and 1.5 sq mm. Easy to work with, highly flexible and reliably insulated.",
        "features": ["Appliance grade", "PVC insulated", "Easy termination", "Kink resistant", "RoHS compliant"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"conductor": "Copper", "cores": "2", "voltage": "300/500V", "sizes": "0.75–1.5 sq mm", "application": "Appliances"}
    },
    {
        "name": "Shielded Control Flexible Cable",
        "category": "Flexible Cable",
        "description": "Shielded multi-core flexible cable with copper braid or aluminium foil screen for EMI/RFI sensitive control applications. Used in CNC machines, PLCs, variable frequency drives and any system where signal integrity is critical.",
        "features": ["Copper braid shielded", "EMI/RFI protection", "Drain wire included", "Flexible stranded core", "Industrial grade"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"shielding": "Copper braid", "cores": "2–12", "voltage": "300/500V", "application": "PLC/CNC control", "standard": "IS 694"}
    },
    # ── CCTV CABLES ─────────────────────────────────────────────────────────────
    {
        "name": "RG-6 CCS CCTV Coaxial Cable",
        "category": "CCTV Cables",
        "description": "RG-6 coaxial cable with Copper Clad Steel (CCS) inner conductor for CCTV camera installations. 75 ohm impedance ensures minimal signal loss over long runs up to 300 metres. Most widely used coaxial cable for AHD, HD-CVI, HD-TVI and analog CCTV systems.",
        "features": ["75 ohm impedance", "CCS inner conductor", "Al foil + braid shield", "UV resistant jacket", "Low signal loss"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"impedance": "75 Ohm", "conductor": "CCS (Copper Clad Steel)", "shield": "Al foil + braid", "jacket": "PVC UV-resistant", "run_length": "Up to 300m"}
    },
    {
        "name": "RG-6 Pure Copper CCTV Coaxial Cable",
        "category": "CCTV Cables",
        "description": "RG-6 coaxial cable with pure copper inner conductor for premium CCTV and satellite TV installations. Better signal quality than CCS over long runs — the preferred choice for IP cameras, HD CCTV and antenna feeds. Oxygen-free copper (OFC) available.",
        "features": ["Pure copper conductor", "Lowest signal loss", "75 ohm impedance", "HD camera compatible", "Satellite TV rated"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"impedance": "75 Ohm", "conductor": "Pure Copper / OFC", "shield": "Al foil + braid", "jacket": "UV-resistant PVC", "standard": "IS 10098"}
    },
    {
        "name": "1+3 CCTV Combo Cable",
        "category": "CCTV Cables",
        "description": "1 RG-59 coaxial + 3-core power cable in a single flat jacket. Simplifies CCTV installation by carrying video signal and power supply wires together. Ideal for indoor CCTV systems with up to 12V/24V DC cameras. Eliminates double cable runs.",
        "features": ["Video + power combined", "1 coax + 3 power cores", "Easy installation", "Neat single cable run", "Indoor CCTV use"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"coax": "RG-59 CCS", "power_cores": "3", "power_conductor": "0.5 sq mm copper", "jacket": "PVC flat", "application": "Indoor CCTV"}
    },
    {
        "name": "1+4 CCTV Combo Cable",
        "category": "CCTV Cables",
        "description": "1 RG-59 coaxial + 4-core power cable for CCTV systems requiring PTZ (pan-tilt-zoom) control. The 4-core power section carries video, power and RS-485 control signal in one cable run. Perfect for PTZ dome cameras in commercial installations.",
        "features": ["PTZ compatible", "1 coax + 4 power cores", "RS-485 control ready", "Reduced cable clutter", "Commercial grade"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"coax": "RG-59 CCS", "power_cores": "4", "power_conductor": "0.5 sq mm copper", "jacket": "PVC flat", "application": "PTZ CCTV cameras"}
    },
    {
        "name": "1+6 CCTV Combo Cable",
        "category": "CCTV Cables",
        "description": "1 RG-59 coaxial + 6-core power cable for advanced CCTV and access control integration. The 6-core section supports video, power, audio, alarm relay and control signals in a single installation run. Reduces cabling complexity in large security systems.",
        "features": ["6 function cores", "Audio & alarm support", "Access control wiring", "Single run convenience", "Large system grade"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"coax": "RG-59 CCS", "power_cores": "6", "power_conductor": "0.5 sq mm copper", "jacket": "PVC flat", "application": "Integrated security systems"}
    },
    # ── COPPER WIRE ─────────────────────────────────────────────────────────────
    {
        "name": "Bare Copper Wire",
        "category": "Copper Wire",
        "description": "High purity bare copper wire for earthing, electrical connections and conductor manufacturing. 99.9% electrolytic grade copper. Available in round and bunched stranded forms from 0.5 sq mm to 50 sq mm. Used extensively by panel builders, transformer manufacturers and electricians.",
        "features": ["99.9% pure copper", "Excellent conductivity", "Earthing applications", "Round & stranded", "Low resistance"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"purity": "99.9% electrolytic", "sizes": "0.5–50 sq mm", "type": "Bare / uncoated", "application": "Earthing, connections", "standard": "IS 8130"}
    },
    {
        "name": "Tinned Copper Wire",
        "category": "Copper Wire",
        "description": "Electrolytic copper wire with a uniform tin coating for superior corrosion resistance and solderability. Used in marine wiring, humid environments and wherever soldering is required. The tin coat prevents oxidation and ensures reliable long-term connections. Sizes 0.5 to 50 sq mm.",
        "features": ["Tin coated", "Corrosion resistant", "Easy soldering", "Marine grade", "Anti-oxidation"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"coating": "Tin", "base": "Electrolytic copper", "sizes": "0.5–50 sq mm", "application": "Marine, humid environments", "standard": "IS 8130"}
    },
    {
        "name": "Copper Earthing Wire (EC Grade)",
        "category": "Copper Wire",
        "description": "EC (Electrical Conductivity) grade copper earthing wire for proper grounding of electrical installations as per IS 3043. Available in solid and stranded construction. Ensures low impedance earth path to protect personnel and equipment from fault currents.",
        "features": ["EC grade copper", "IS 3043 compliant", "Solid & stranded", "Low earth resistance", "Safety critical"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"grade": "EC (Electrical Conductivity)", "sizes": "1.5–50 sq mm", "type": "Solid / Stranded", "application": "Earthing & grounding", "standard": "IS 3043 / IS 8130"}
    },
    # ── SUBMERSIBLE CABLE ───────────────────────────────────────────────────────
    {
        "name": "1.5 Sq.mm Single Phase Submersible Cable",
        "category": "Submersible Cable",
        "description": "1.5 sq mm single-phase (2-core) submersible pump cable for ½ HP to 1 HP domestic borewell pumps. Special waterproof PVC insulation rated for continuous submersion. Resists groundwater chemicals, motor oil and UV radiation at surface. ISI marked.",
        "features": ["ISI marked", "Waterproof PVC", "1/2–1 HP pump rated", "Chemical resistant", "Borewell grade"],
        "image": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
        "specs": {"size": "1.5 sq mm", "cores": "2 (single phase)", "voltage": "300/500V", "pump_rating": "0.5–1 HP", "standard": "IS 694"}
    },
    {
        "name": "2.5 Sq.mm Single Phase Submersible Cable",
        "category": "Submersible Cable",
        "description": "2.5 sq mm single-phase submersible cable for 1 HP to 2 HP borewell and water well pumps. Most popular size for domestic borewells up to 150 feet depth. Waterproof construction with heavy duty outer jacket for long-term underground and underwater use.",
        "features": ["ISI marked", "Most popular domestic size", "1–2 HP rating", "Heavy duty jacket", "UV + chemical resistant"],
        "image": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
        "specs": {"size": "2.5 sq mm", "cores": "2 (single phase)", "voltage": "300/500V", "pump_rating": "1–2 HP", "standard": "IS 694"}
    },
    {
        "name": "4 Sq.mm Three Phase Submersible Cable",
        "category": "Submersible Cable",
        "description": "4 sq mm 3-core three-phase submersible cable for 3 HP to 7.5 HP agricultural and industrial pumps. Essential for deep borewells beyond 200 feet and high-capacity water supply systems. Reinforced waterproof jacket withstands high pressure and continuous immersion.",
        "features": ["Three-phase 3-core", "3–7.5 HP rating", "Deep borewell rated", "Reinforced jacket", "Agriculture grade"],
        "image": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
        "specs": {"size": "4 sq mm", "cores": "3 (three phase)", "voltage": "415V", "pump_rating": "3–7.5 HP", "standard": "IS 694"}
    },
    {
        "name": "6 Sq.mm Three Phase Submersible Cable",
        "category": "Submersible Cable",
        "description": "6 sq mm 3-core three-phase submersible cable for high-capacity 7.5 HP to 15 HP pumps used in deep borewells, irrigation systems and commercial water supply. Thick waterproof PVC insulation ensures safe operation at depths exceeding 300 feet.",
        "features": ["High HP rating", "7.5–15 HP capacity", "Deep well 300ft+", "Extra thick insulation", "Industrial grade"],
        "image": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
        "specs": {"size": "6 sq mm", "cores": "3 (three phase)", "voltage": "415V", "pump_rating": "7.5–15 HP", "standard": "IS 694"}
    },
    # ── CAT6 & LAN CABLES ───────────────────────────────────────────────────────
    {
        "name": "CAT6 UTP Cable — 305mtr Box",
        "category": "CAT6 & LAN Cables",
        "description": "CAT6 unshielded twisted pair (UTP) LAN cable in a full 305-metre pull box for network installations. Supports Gigabit Ethernet (1000BASE-T) and 10-Gigabit Ethernet up to 37m (10GBASE-T). 23 AWG solid copper conductors, 250 MHz bandwidth. Ideal for structured cabling of office buildings, server rooms and residential complexes.",
        "features": ["Gigabit Ethernet ready", "250 MHz bandwidth", "23 AWG solid copper", "Full 305mtr box", "EIA/TIA 568-C.2 compliant"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"standard": "CAT6 / EIA-568-C.2", "conductors": "4 pairs / 23 AWG", "bandwidth": "250 MHz", "length": "305 metres", "application": "Gigabit LAN, structured cabling"}
    },
    {
        "name": "CAT6 UTP Cable — 90mtr Box",
        "category": "CAT6 & LAN Cables",
        "description": "CAT6 UTP cable in a convenient 90-metre box for smaller installations — single floors, retail shops, small offices and home networks. Same high-quality 23 AWG solid copper with 250 MHz performance as the 305mtr roll, in an easy-to-handle pack size.",
        "features": ["Compact 90mtr pack", "Gigabit compatible", "23 AWG copper", "Easy to handle", "Home & small office"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"standard": "CAT6 / EIA-568-C.2", "conductors": "4 pairs / 23 AWG", "bandwidth": "250 MHz", "length": "90 metres", "application": "Home, retail, small office"}
    },
    {
        "name": "CAT6 Outdoor Armoured LAN Cable",
        "category": "CAT6 & LAN Cables",
        "description": "CAT6 armoured LAN cable for outdoor, underground and long-distance campus network runs. Steel wire armour provides rodent and mechanical protection while the UV-stabilised PE outer jacket handles direct burial. Bridges buildings, connects outdoor equipment and spans campuses without conduit in many cases.",
        "features": ["Direct burial rated", "Steel wire armour", "UV-resistant PE jacket", "Rodent proof", "Campus networking"],
        "image": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
        "specs": {"standard": "CAT6", "armour": "Steel wire (SWA)", "jacket": "UV-stabilised PE", "conductor": "23 AWG solid copper", "application": "Outdoor, underground, campus"}
    },
    {
        "name": "CAT5e UTP Cable — 305mtr Box",
        "category": "CAT6 & LAN Cables",
        "description": "CAT5e UTP cable in a 305-metre box — the most economical choice for 100 Mbps Fast Ethernet and basic Gigabit networks. Suitable for budget-conscious projects, CCTV network backbones, IP phone systems and access control wiring where CAT6 performance is not required.",
        "features": ["Fast Ethernet ready", "Budget friendly", "305mtr full box", "24 AWG copper", "CCTV & IP phone wiring"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"standard": "CAT5e / EIA-568-B.2", "conductors": "4 pairs / 24 AWG", "bandwidth": "100 MHz", "length": "305 metres", "application": "100Mbps–1Gbps Ethernet"}
    },
    # ── TELEPHONE & COMMUNICATION CABLE ────────────────────────────────────────
    {
        "name": "TCBC Telephone Wire (Twisted Pair)",
        "category": "Telephone & Communication Cable",
        "description": "Tinned Copper Braided Conductor (TCBC) telephone wire — the standard internal telephone wiring cable for EPABX systems, intercom networks and telephone extensions in Indian offices and residential complexes. Twisted pair construction minimises crosstalk and interference between lines.",
        "features": ["Twisted pair construction", "Tinned copper conductor", "EPABX compatible", "Low crosstalk", "ISI compliant"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"conductor": "Tinned Copper", "type": "Twisted pair", "application": "EPABX, telephone extension", "insulation": "PVC", "standard": "IS 6239"}
    },
    {
        "name": "2 Pair Telephone Cable",
        "category": "Telephone & Communication Cable",
        "description": "2-pair (4-wire) telephone cable for single telephone line with spare pair. Used for last-mile telephone connections, door-phone wiring and basic intercom systems. Twisted pair construction for noise immunity. Available in indoor and outdoor variants.",
        "features": ["2 twisted pairs", "1 line + 1 spare", "Low attenuation", "Doorphone wiring", "Intercom ready"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"pairs": "2 (4 wires)", "conductor": "0.5mm copper", "insulation": "PVC colour coded", "application": "Telephone, intercom, doorphone", "standard": "IS 6239"}
    },
    {
        "name": "4 Pair Telephone Cable",
        "category": "Telephone & Communication Cable",
        "description": "4-pair (8-wire) telephone cable for multi-line telephone systems and EPABX distribution. Supports up to 4 independent telephone or intercom lines in one cable run. Standard for office EPABX wiring from distribution box to individual workstations.",
        "features": ["4 twisted pairs", "EPABX distribution", "4 independent lines", "Colour coded pairs", "Office grade"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"pairs": "4 (8 wires)", "conductor": "0.5mm copper", "insulation": "PVC colour coded", "application": "EPABX, multi-line office", "standard": "IS 6239"}
    },
    {
        "name": "Multi Pair Telephone Cable (10 / 20 Pair)",
        "category": "Telephone & Communication Cable",
        "description": "Multi-pair telephone distribution cable in 10-pair and 20-pair configurations for building riser cables and main distribution frames (MDF). Connects the telephone exchange or EPABX main unit to floor-level distribution boxes. Essential for structured telephone cabling in large offices, hotels and commercial buildings.",
        "features": ["10 or 20 pairs", "Riser / backbone cable", "MDF to IDF runs", "Colour coded pairs", "High pair count"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"pairs": "10 or 20 pairs", "conductor": "0.5mm copper", "insulation": "PVC", "application": "Building riser, MDF/IDF", "standard": "IS 6239"}
    },
]

async def seed_products():
    count = await db.products.count_documents({})
    if count == 0:
        for p in PRODUCTS_DATA:
            product = Product(**p)
            doc = product.model_dump()
            await db.products.insert_one(doc)
        logging.info(f"Seeded {len(PRODUCTS_DATA)} products")
    else:
        logging.info(f"Products already seeded: {count}")

@app.on_event("startup")
async def startup():
    await seed_products()

@api_router.get("/")
async def root():
    return {"message": "Angel Cables API"}

@api_router.get("/products")
async def get_products(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products

@api_router.get("/products/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return categories

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product

def _fetch_image(url: str) -> Optional[BytesIO]:
    try:
        r = req_lib.get(url, timeout=6)
        if r.status_code == 200 and "image" in r.headers.get("content-type", ""):
            return BytesIO(r.content)
    except Exception:
        pass
    return None

def _build_catalog_pdf(products: list) -> bytes:
    from fpdf import FPDF

    # Group products by category preserving order
    categories: dict[str, list] = {}
    for p in products:
        cat = p.get("category", "Other")
        categories.setdefault(cat, []).append(p)

    NAVY  = (15, 23, 42)
    ORANGE = (234, 88, 12)
    SLATE  = (71, 85, 105)
    LIGHT  = (248, 250, 252)
    BORDER = (226, 232, 240)
    WHITE  = (255, 255, 255)
    MUTED  = (148, 163, 184)

    class PDF(FPDF):
        def header(self):
            if self.page_no() == 1:
                return
            self.set_fill_color(*NAVY)
            self.rect(0, 0, 210, 11, "F")
            self.set_font("Helvetica", "B", 7)
            self.set_text_color(*ORANGE)
            self.set_xy(12, 3)
            self.cell(100, 5, "ANGEL CABLES  -  Product Catalog 2025")
            self.set_text_color(*MUTED)
            self.set_xy(0, 3)
            self.cell(198, 5, f"Page {self.page_no() - 1}", align="R")
            self.set_y(14)

        def footer(self):
            if self.page_no() == 1:
                return
            self.set_y(-11)
            self.set_font("Helvetica", "", 7)
            self.set_text_color(*MUTED)
            self.cell(0, 5,
                "B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035  |  "
                "+91 9873816127  |  angelcables.com",
                align="C")

    pdf = PDF(format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(12, 14, 12)

    # ── COVER PAGE ──────────────────────────────────────────────
    pdf.add_page()

    # Full-page navy background
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 210, 297, "F")

    # Orange diagonal accent (top-right)
    pdf.set_fill_color(*ORANGE)
    pdf.rect(140, 0, 70, 70, "F")

    # Subtle orange strip mid-page
    pdf.set_fill_color(234, 88, 12)
    pdf.rect(0, 108, 210, 6, "F")

    # Brand
    pdf.set_font("Helvetica", "B", 52)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(0, 52)
    pdf.cell(210, 20, "ANGEL CABLES", align="C")

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(0, 80)
    pdf.cell(210, 8, "Powering India with Precision & Safety", align="C")

    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(0, 120)
    pdf.cell(210, 10, "PRODUCT CATALOG 2025", align="C")

    # Stats row
    stats = [
        (f"{len(products)}+", "Products"),
        (str(len(categories)), "Categories"),
        ("ISI", "Certified"),
        ("2005", "Est."),
    ]
    for i, (val, label) in enumerate(stats):
        x = 12 + i * 47
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x, 148)
        pdf.cell(43, 9, val, align="C")
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(*MUTED)
        pdf.set_xy(x, 158)
        pdf.cell(43, 5, label.upper(), align="C")

    # Bottom contact block
    pdf.set_fill_color(10, 15, 30)
    pdf.rect(0, 240, 210, 57, "F")
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(0, 250)
    pdf.cell(210, 7, "A Unit of R K Enterprises", align="C")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(0, 260)
    pdf.cell(210, 6, "B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi - 110035", align="C")
    pdf.set_xy(0, 267)
    pdf.cell(210, 6, "+91 9873816127  |  angelcables.com", align="C")
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(50, 65, 85)
    pdf.set_xy(0, 280)
    pdf.cell(210, 5, f"(c) {datetime.now().year} Angel Cables. All rights reserved.", align="C")

    # ── PRODUCT PAGES ────────────────────────────────────────────
    IMG_W, IMG_H = 42, 34
    ROW_H = 46
    TEXT_X = 57
    TEXT_W = 140

    for cat_name, cat_products in categories.items():
        pdf.add_page()

        # Category heading
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(*ORANGE)
        pdf.set_xy(12, pdf.get_y())
        pdf.cell(0, 9, cat_name.upper())
        pdf.set_draw_color(*ORANGE)
        pdf.set_line_width(0.4)
        y_line = pdf.get_y() + 0.5
        pdf.line(12, y_line, 198, y_line)
        pdf.ln(5)

        for product in cat_products:
            if pdf.get_y() > 262:
                pdf.add_page()
                pdf.ln(2)

            top = pdf.get_y()

            # Card background
            pdf.set_fill_color(*LIGHT)
            pdf.set_draw_color(*BORDER)
            pdf.set_line_width(0.2)
            pdf.rect(12, top, 186, ROW_H, "FD")

            # Product image
            img = _fetch_image(product.get("image", ""))
            if img:
                try:
                    pdf.image(img, x=14, y=top + 3, w=IMG_W, h=IMG_H)
                except Exception:
                    _draw_placeholder(pdf, 14, top + 3, IMG_W, IMG_H)
            else:
                _draw_placeholder(pdf, 14, top + 3, IMG_W, IMG_H)

            # Name
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*NAVY)
            pdf.set_xy(TEXT_X, top + 4)
            name = product.get("name", "")
            pdf.cell(TEXT_W, 6, name[:60])

            # Category tag
            pdf.set_font("Helvetica", "", 7)
            pdf.set_text_color(*ORANGE)
            pdf.set_xy(TEXT_X, top + 10.5)
            pdf.cell(TEXT_W, 4, cat_name.upper())

            # Description
            pdf.set_font("Helvetica", "", 8)
            pdf.set_text_color(*SLATE)
            desc = product.get("description", "")
            if len(desc) > 130:
                desc = desc[:127] + "..."
            pdf.set_xy(TEXT_X, top + 16)
            pdf.multi_cell(TEXT_W, 4, desc)

            # Specs
            specs = product.get("specs", {})
            if specs:
                spec_str = "   |   ".join(f"{k}: {v}" for k, v in list(specs.items())[:3])
                pdf.set_font("Helvetica", "B", 7)
                pdf.set_text_color(100, 116, 139)
                pdf.set_xy(TEXT_X, top + 33)
                pdf.cell(TEXT_W, 4, spec_str)

            # Features
            features = product.get("features", [])[:4]
            if features:
                feat_str = "  /  ".join(features)
                pdf.set_font("Helvetica", "", 7)
                pdf.set_text_color(100, 116, 139)
                pdf.set_xy(TEXT_X, top + 39)
                pdf.cell(TEXT_W, 4, feat_str)

            pdf.set_y(top + ROW_H + 4)

    return bytes(pdf.output())

def _draw_placeholder(pdf, x, y, w, h):
    from fpdf import FPDF
    pdf.set_fill_color(203, 213, 225)
    pdf.rect(x, y, w, h, "F")

@api_router.get("/catalog/pdf")
async def download_catalog_pdf():
    products = await db.products.find({}, {"_id": 0}).to_list(200)
    loop = asyncio.get_event_loop()
    pdf_bytes = await loop.run_in_executor(None, _build_catalog_pdf, products)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="angel-cables-catalog-2025.pdf"'},
    )

@api_router.post("/dealer-enquiry")
async def submit_dealer_enquiry(form: DealerForm):
    enquiry = DealerEnquiry(**form.model_dump())
    await db.dealer_enquiries.insert_one(enquiry.model_dump())
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _send_email,
        f"New Dealer Enquiry: {form.name} ({form.company})",
        _dealer_email_html(form.model_dump()))
    return {"success": True, "message": "Thank you for your interest! Our team will contact you within 24 hours."}

@api_router.post("/contact")
async def submit_contact(form: ContactForm):
    submission = ContactSubmission(**form.model_dump())
    await db.contact_submissions.insert_one(submission.model_dump())
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _send_email,
        f"New Contact Enquiry: {form.name}",
        _contact_email_html(form.model_dump()))
    return {"success": True, "message": "Thank you for your enquiry. We will get back to you shortly."}


# ── ADMIN ────────────────────────────────────────────────────────────────────

def _check_admin(x_admin_key: str = Header(default="")):
    if not ADMIN_API_KEY or x_admin_key != ADMIN_API_KEY:
        raise FastAPIHTTPException(status_code=401, detail="Unauthorized")

@api_router.get("/admin/contacts")
async def admin_get_contacts(x_admin_key: str = Header(default="")):
    _check_admin(x_admin_key)
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs

@api_router.get("/admin/dealer-enquiries")
async def admin_get_dealer_enquiries(x_admin_key: str = Header(default="")):
    _check_admin(x_admin_key)
    docs = await db.dealer_enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs

@api_router.get("/admin/stats")
async def admin_get_stats(x_admin_key: str = Header(default="")):
    _check_admin(x_admin_key)
    contacts = await db.contact_submissions.count_documents({})
    dealers  = await db.dealer_enquiries.count_documents({})
    products = await db.products.count_documents({})
    return {"contacts": contacts, "dealer_enquiries": dealers, "products": products}

@api_router.post("/admin/products/reseed")
async def admin_reseed_products(x_admin_key: str = Header(default="")):
    """Clear all products and re-insert from PRODUCTS_DATA. Protected by admin key."""
    _check_admin(x_admin_key)
    await db.products.delete_many({})
    inserted = []
    for p in PRODUCTS_DATA:
        product = Product(**p)
        doc = product.model_dump()
        await db.products.insert_one(doc)
        inserted.append(doc["name"])
    return {"success": True, "inserted": len(inserted), "products": inserted}

@api_router.get("/company")
async def get_company_info():
    return {
        "name": "Angel Cables",
        "parent_company": "R K Enterprises",
        "tagline": "Powering India with Precision & Safety",
        "address": "B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035",
        "phone": "+91 9873816127",
        "email": "rkenterprises.ahuja@gmail.com",
        "hours": "Mon-Sat: 10:00 AM - 8:00 PM",
        "established": "2005",
        "whatsapp": "919873816127"
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

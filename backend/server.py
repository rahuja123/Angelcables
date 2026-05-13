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
    {
        "name": "Aluminium Armoured Cable",
        "category": "Armoured Cable",
        "description": "High-quality aluminium armoured cables designed for underground and outdoor power distribution. Built to withstand harsh conditions with superior mechanical protection.",
        "features": ["Corrosion resistant", "High tensile strength", "Weather proof", "ISI certified"],
        "image": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
        "specs": {"material": "Aluminium", "insulation": "PVC/XLPE", "voltage": "Up to 1.1 kV"}
    },
    {
        "name": "3 Core Armoured Cable",
        "category": "Armoured Cable",
        "description": "Three core armoured cables for three-phase power supply systems. Ideal for industrial installations and heavy-duty applications requiring reliable power transmission.",
        "features": ["Three-phase compatible", "Steel wire armour", "Flame retardant", "Long service life"],
        "image": "https://productimages.withfloats.com/actual/68e49bf05c295f6c8beebf4e.jpg",
        "specs": {"cores": "3", "insulation": "PVC", "voltage": "Up to 1.1 kV"}
    },
    {
        "name": "Copper Armoured Cable",
        "category": "Armoured Cable",
        "description": "Premium copper armoured cables offering excellent conductivity with robust mechanical protection. Perfect for critical power infrastructure and industrial setups.",
        "features": ["Superior conductivity", "Mechanical protection", "Fire resistant", "Durable construction"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"material": "Copper", "insulation": "PVC/XLPE", "voltage": "Up to 1.1 kV"}
    },
    {
        "name": "4 Core Armoured Cable",
        "category": "Armoured Cable",
        "description": "Four core armoured cables designed for three-phase plus neutral power distribution. Heavy-duty construction for demanding industrial environments.",
        "features": ["4-core design", "Underground rated", "Impact resistant", "Temperature stable"],
        "image": "https://productimages.withfloats.com/actual/68e4995b1a14f21bee4f1cc3.png",
        "specs": {"cores": "4", "insulation": "PVC", "voltage": "Up to 1.1 kV"}
    },
    {
        "name": "Multi Core Control Copper Flexible Cables",
        "category": "Flexible Cable",
        "description": "Multi-core control cables for instrumentation and control wiring in industrial and commercial buildings. Excellent flexibility for complex routing needs.",
        "features": ["Fine finish", "Reliable performance", "High strength", "Multi-core design"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"material": "Copper", "type": "Flexible", "application": "Control wiring"}
    },
    {
        "name": "Two Core Flexible Cable",
        "category": "Flexible Cable",
        "description": "High-quality two core flexible cables suitable for domestic and light commercial applications. Superior insulation with long service life.",
        "features": ["Dimensional accuracy", "Optimum insulation", "Long lasting life", "Flexible design"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"cores": "2", "type": "Flexible", "application": "Domestic & Commercial"}
    },
    {
        "name": "Shielded Control Flexible Cable",
        "category": "Flexible Cable",
        "description": "Premium shielded control flexible cables for noise-sensitive applications. EMI protection ensures clean signal transmission in industrial environments.",
        "features": ["Current limiting design", "Flawless finish", "Flexible", "EMI shielded"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"type": "Shielded Flexible", "application": "Control systems", "shielding": "Copper braid"}
    },
    {
        "name": "Single Core Housewire Cable",
        "category": "Electric House Wire",
        "description": "Premium single core house wiring cables for residential and commercial electrical installations. Made with pure copper conductors for maximum safety.",
        "features": ["Pure copper conductor", "PVC insulated", "ISI marked", "Heat resistant"],
        "image": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
        "specs": {"material": "Copper", "insulation": "PVC", "voltage": "Up to 1.1 kV"}
    },
    {
        "name": "Multi Strand Wire",
        "category": "Electric House Wire",
        "description": "Multi-strand copper wires offering superior flexibility for internal house wiring. Easier to work with while maintaining excellent conductivity.",
        "features": ["Multi-strand design", "High flexibility", "Safe insulation", "Easy installation"],
        "image": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
        "specs": {"material": "Copper", "type": "Multi-strand", "application": "House wiring"}
    },
    {
        "name": "CCTV Cables",
        "category": "CCTV Cables",
        "description": "Specialized CCTV cables for security camera installations. Combines video and power transmission in a single cable for clean, professional installations.",
        "features": ["Video + Power combo", "Low signal loss", "Weather resistant", "Easy termination"],
        "image": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
        "specs": {"type": "Coaxial + Power", "application": "CCTV Systems", "shielding": "Copper braid"}
    },
    {
        "name": "1.5 Sq.mm Copper Armored Wire",
        "category": "Copper Wire",
        "description": "1.5 sq.mm copper armored wire for protected power transmission. Combines copper's conductivity with armoured protection for versatile applications.",
        "features": ["High conductivity", "Armoured protection", "Versatile use", "Quality tested"],
        "image": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
        "specs": {"size": "1.5 sq.mm", "material": "Copper", "type": "Armoured"}
    },
    {
        "name": "Submersible Cable",
        "category": "Submersible Cable",
        "description": "Specially designed submersible pump cables for underwater motor applications. Waterproof construction ensures reliable performance in borewells and water pumps.",
        "features": ["Waterproof design", "UV resistant", "High insulation", "Pump rated"],
        "image": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
        "specs": {"type": "Submersible", "application": "Water pumps", "insulation": "PVC waterproof"}
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

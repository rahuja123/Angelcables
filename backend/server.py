from fastapi import FastAPI, APIRouter
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

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

@api_router.post("/contact")
async def submit_contact(form: ContactForm):
    submission = ContactSubmission(**form.model_dump())
    doc = submission.model_dump()
    await db.contact_submissions.insert_one(doc)
    return {"success": True, "message": "Thank you for your enquiry. We will get back to you shortly."}

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

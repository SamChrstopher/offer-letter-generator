from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Depends
from fastapi.responses import FileResponse
import os, shutil, uuid

from sqlalchemy.orm import Session

from config.database import get_db
from services.excel_service import parse_excel
from services.template_service import generate_docx
from utils.dependencies import get_current_user  
from models.offerletter_model import OfferLetter
from typing import Optional


router = APIRouter(tags=["Generator"])

UPLOAD_DIR = "uploads"
TEMPLATE_PATH = "template.docx"

os.makedirs(UPLOAD_DIR, exist_ok=True)

DATA_STORE = {}


# ==============================
# UPLOAD EXCEL
# ==============================
@router.post("/upload")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx allowed")

    file_id = str(uuid.uuid4())
    main_path = os.path.join(UPLOAD_DIR, f"{file_id}.xlsx")

    with open(main_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    data = parse_excel(main_path)

    if not data:
        raise HTTPException(status_code=400, detail="Empty Excel")

    DATA_STORE[file_id] = {"data": data}

    return {
        "file_id": file_id,
        "total_candidates": len(data)
    }

# ==============================
# GENERATE FROM EXCEL DATA
# ==============================
@router.post("/generate/{file_id}")
def generate(
    file_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if file_id not in DATA_STORE:
        raise HTTPException(status_code=404, detail="Invalid file_id")

    stored = DATA_STORE[file_id]
    data = stored["data"]

    docx_records = generate_docx(
        data=data,
        template_path=TEMPLATE_PATH,
        db=db,
        user_id=current_user.id
    )

    return {"message": "Generated successfully", "results": docx_records}


# ==============================
# GENERATE FROM FORM
# ==============================
@router.post("/generate-from-form")
def generate_from_form(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    data = [payload]
    doc_no = payload.get("DocNo", "DOC001")

    results = generate_docx(
        data=data,
        template_path=TEMPLATE_PATH,
        db=db,
        user_id=current_user.id,
        doc_no=doc_no
    )

    return {"message": "Generated successfully", "results": results}


# ==============================
# LIST LOGGED-IN USER OFFER LETTERS
# ==============================
@router.get("/my-offerletters")
def my_offerletters(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    letters = db.query(OfferLetter).filter(
        OfferLetter.user_id == current_user.id
    ).order_by(OfferLetter.created_at.desc()).all()

    return letters


# ==============================
# DOWNLOAD OFFER LETTER USING ID
# ==============================
@router.get("/download/{offer_id}")
def download_offerletter(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    offer = db.query(OfferLetter).filter(
        OfferLetter.id == offer_id,
        OfferLetter.user_id == current_user.id
    ).first()

    if not offer:
        raise HTTPException(status_code=404, detail="Offer letter not found")

    if not os.path.exists(offer.file_path):
        raise HTTPException(status_code=404, detail="File missing from server")

    return FileResponse(
        path=offer.file_path,
        filename=offer.file_name,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
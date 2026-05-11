from services.salary_service import calculate_salary
from services.mapping_service import map_record
from datetime import datetime
from docxtpl import DocxTemplate
import os
import uuid


from models.offerletter_model import OfferLetter

UPLOAD_DIR = "uploads/offerletters"


def transform_form_to_mapping_keys(record):
    return {k.replace("_", " "): v for k, v in record.items()}


from datetime import datetime

def format_date_long(date_value):
    if not date_value:
        return ""

    try:
        # If already datetime (Excel case)
        if isinstance(date_value, datetime):
            date = date_value
        else:
            date_str = str(date_value)

            # Try multiple formats
            try:
                date = datetime.strptime(date_str, "%d-%m-%Y")
            except:
                date = datetime.strptime(date_str, "%Y-%m-%d")

        day = date.day

        # suffix logic
        if 11 <= day <= 13:
            suffix = "th"
        else:
            suffix = {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")

        return f"{day}{suffix} {date.strftime('%B %Y')}"

    except:
        return str(date_value)

def format_date_short(date_value):
    if not date_value:
        return ""

    try:
        if isinstance(date_value, datetime):
            date = date_value
        else:
            date_str = str(date_value)

            try:
                date = datetime.strptime(date_str, "%d-%m-%Y")
            except:
                date = datetime.strptime(date_str, "%Y-%m-%d")

        return date.strftime("%d-%m-%Y")

    except:
        return str(date_value)
def generate_docx(data, template_path, db, user_id, doc_no=None):
    generated = []

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    for record in data:
        doc = DocxTemplate(template_path)

        record = transform_form_to_mapping_keys(record)
        mapped_data = map_record(record)
        # ==============================
        # DATE FORMATTING (SHORT + LONG)
        # ==============================
        raw_doj = mapped_data.get("DOJ")

        mapped_data["DOJ"] = format_date_short(raw_doj)        # 17-04-2026
        mapped_data["DOJ_LONG"] = format_date_long(raw_doj)    # 17th April 2026
        mapped_data["DocNo"] = doc_no or mapped_data.get("DocNo") or "DOC001"
        mapped_data["Year"] = datetime.now().year
        

        # ==============================
        # SALARY CALCULATION
        # ==============================
        proposed_ctc = mapped_data.get("Proposed_CTC")

        if proposed_ctc not in ["", None, 0, "0"]:
            salary_data = calculate_salary(proposed_ctc)
            for key, value in salary_data.items():
                mapped_data[key] = value

        # ==============================
        # REVISED CTC
        # ==============================
        revised_ctc = mapped_data.get("Revised_CTC")

        if revised_ctc not in ["", None, 0, "0"]:
            revised_salary = calculate_salary(revised_ctc)

            for key, value in revised_salary.items():
                mapped_data[f"Revised_{key}"] = value

            mapped_data["has_revised_ctc"] = True
        else:
            mapped_data["has_revised_ctc"] = False

        # ==============================
        # RENDER TEMPLATE
        # ==============================
        doc.render(mapped_data)

        safe_name = (mapped_data.get("Candidate_Name") or "Unknown").replace(" ", "_")

        unique_id = str(uuid.uuid4())

        stored_filename = f"{safe_name}_OfferLetter_{unique_id}.docx"   # DB + folder
        display_filename = f"{safe_name}_OfferLetter.docx"              # UI

        filepath = os.path.join(UPLOAD_DIR, stored_filename)

        doc.save(filepath)

        offer = OfferLetter(
            user_id=user_id,
            candidate_name=mapped_data.get("Candidate_Name") or "Unknown",
            doc_no=mapped_data.get("DocNo"),
            file_name=stored_filename,   # store real filename in DB
            file_path=filepath
        )

        db.add(offer)
        db.commit()
        db.refresh(offer)

        generated.append({
            "offer_id": offer.id,
            "candidate_name": offer.candidate_name,
            "doc_no": offer.doc_no,
            "file_name": display_filename,   
            "created_at": offer.created_at
        })

    return generated
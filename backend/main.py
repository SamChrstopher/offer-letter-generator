# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.responses import FileResponse
# from fastapi.middleware.cors import CORSMiddleware

# import os
# import shutil
# import uuid

# from services.excel_service import parse_excel
# from services.template_service import generate_docx
# from fastapi import Form, Body


# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Directories
# UPLOAD_DIR = "uploads"
# TEMP_DIR = "temp"
# TEMPLATE_PATH = "template.docx"

# os.makedirs(UPLOAD_DIR, exist_ok=True)
# os.makedirs(TEMP_DIR, exist_ok=True)

# DATA_STORE = {}

# # Upload Excel

# @app.post("/upload")
# async def upload_excel(
#     file: UploadFile = File(...),
#     doc_no: str = Form(...)
# ):
#     if not file.filename.endswith(".xlsx"):
#         raise HTTPException(status_code=400, detail="Only .xlsx allowed")

#     file_id = str(uuid.uuid4())

#     main_path = os.path.join(UPLOAD_DIR, f"{file_id}.xlsx")

#     with open(main_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     data = parse_excel(main_path)

#     if not data:
#         raise HTTPException(status_code=400, detail="Empty Excel")

#     DATA_STORE[file_id] = {
#         "data": data,
#         "doc_no": doc_no
#     }

#     return {
#         "file_id": file_id,
#         "total_candidates": len(data)
#     }
    
# @app.post("/generate/{file_id}")
# def generate(file_id: str):
#     if file_id not in DATA_STORE:
#         raise HTTPException(status_code=404, detail="Invalid file_id")

#     stored = DATA_STORE[file_id]

#     data = stored["data"]
#     doc_no = stored["doc_no"]

#     docx_records = generate_docx(data, TEMPLATE_PATH, doc_no)

#     return {
#         "message": "Generated successfully",
#         "results": docx_records
#     } 


# @app.post("/generate-from-form")
# def generate_from_form(payload: dict = Body(...)):
#     try:
#         print("📥 FORM PAYLOAD:", payload)

#         data = [payload]
#         doc_no = payload.get("DocNo", "DOC001")

#         results = generate_docx(data, TEMPLATE_PATH, doc_no)

#         return {
#             "message": "Generated successfully",
#             "results": results
#         }

#     except Exception as e:
#         import traceback
#         print("❌ ERROR:", e)
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e)) 

# @app.get("/download/{filename}")
# def download(filename: str):
#     file_path = os.path.join(TEMP_DIR, filename)  

#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="File not found")

#     return FileResponse(
#         path=file_path,
#         filename=filename,
#         media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
#     )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import Base, engine

from routers.auth_router import router as auth_router
from routers.generator_router import router as generator_router

from models.user_model import User
from models.token_model import RefreshToken

from models.offerletter_model import OfferLetter

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORTANT: no prefix here
app.include_router(auth_router)

app.include_router(generator_router)

@app.get("/")
def home():
    return {"message": "Backend running"}
from pydantic import BaseModel
from datetime import datetime


class OfferLetterResponse(BaseModel):
    id: int
    candidate_name: str
    doc_no: str | None
    file_name: str
    created_at: datetime

    class Config:
        from_attributes = True
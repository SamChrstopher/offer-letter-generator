from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.database import Base


class OfferLetter(Base):
    __tablename__ = "offer_letters"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    candidate_name = Column(String, nullable=False)
    doc_no = Column(String, nullable=True)

    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="offer_letters")
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from config.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(200), unique=True, nullable=True, index=True)

    hashed_password = Column(String, nullable=False)

    role = Column(String(50), default="user")  # user/admin
    is_active = Column(Boolean, default=True)
    
    offer_letters = relationship("OfferLetter", back_populates="user")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
from sqlalchemy import Column, Integer, String, Boolean, Text
from .database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    ingredients = Column(Text)
    steps = Column(Text)
    category = Column(String)
    tried = Column(Boolean, default=False)
    image = Column(String, nullable=True)  # For optional image URLs
    notes=Column(Text,nullable=True)
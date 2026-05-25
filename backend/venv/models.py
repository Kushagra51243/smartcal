from sqlalchemy import Column, Integer, String, Date, Time
from database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    date        = Column(String, nullable=False)  # stored as "2025-06-15"
    time        = Column(String, nullable=True)   # stored as "09:00"
    note        = Column(String, nullable=True)
from pydantic import BaseModel
from typing import Optional

class ReminderCreate(BaseModel):
    title: str
    date: str
    time: Optional[str] = None
    note: Optional[str] = None

class ReminderResponse(BaseModel):
    id: int
    title: str
    date: str
    time: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# This creates the reminders table in the database automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "SmartCal API is running!"}

# GET all reminders
@app.get("/reminders", response_model=List[schemas.ReminderResponse])
def get_reminders(db: Session = Depends(get_db)):
    return db.query(models.Reminder).all()

# GET reminders for a specific date
@app.get("/reminders/{date}", response_model=List[schemas.ReminderResponse])
def get_reminders_by_date(date: str, db: Session = Depends(get_db)):
    return db.query(models.Reminder).filter(models.Reminder.date == date).all()

# POST - create a new reminder
@app.post("/reminders", response_model=schemas.ReminderResponse)
def create_reminder(reminder: schemas.ReminderCreate, db: Session = Depends(get_db)):
    db_reminder = models.Reminder(**reminder.dict())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

# DELETE - remove a reminder
@app.delete("/reminders/{id}")
def delete_reminder(id: int, db: Session = Depends(get_db)):
    reminder = db.query(models.Reminder).filter(models.Reminder.id == id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return {"message": "Reminder deleted"}

# PUT - update a reminder
@app.put("/reminders/{id}", response_model=schemas.ReminderResponse)
def update_reminder(id: int, reminder: schemas.ReminderCreate, db: Session = Depends(get_db)):
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == id).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db_reminder.title = reminder.title
    db_reminder.date = reminder.date
    db_reminder.time = reminder.time
    db_reminder.note = reminder.note
    db.commit()
    db.refresh(db_reminder)
    return db_reminder
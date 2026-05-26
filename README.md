# TaskCal 📅

A full-stack calendar and reminder app built with Python FastAPI and React.

## Features
- View monthly calendar
- Add, edit, delete reminders
- Browser notifications at reminder time
- REST API backend with database storage

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React, Vite
- **Deployment:** Render, Vercel

## Setup Instructions

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Visit `http://localhost:8000/docs` to see the API.

### Frontend
cd frontend
npm install
npm run dev

Visit `http://localhost:5173` to see the app.

## Live Links
- App: https://smartcal-mu.vercel.app
- API Docs: https://smartcal-backend-xx3w.onrender.com/docs

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /reminders | Get all reminders |
| GET | /reminders/{date} | Get reminders for a date |
| POST | /reminders | Create a reminder |
| PUT | /reminders/{id} | Update a reminder |
| DELETE | /reminders/{id} | Delete a reminder |
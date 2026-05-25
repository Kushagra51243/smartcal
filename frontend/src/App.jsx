import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import "./index.css";

const API = "https://smartcal-backend-xx3w.onrender.com";

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [allReminders, setAllReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all reminders (for dots on calendar)
  const fetchAllReminders = async () => {
    const res = await axios.get(`${API}/reminders`);
    setAllReminders(res.data);
  };

  useEffect(() => {
    fetchAllReminders();
  }, []);

  // Load reminders for selected date
  useEffect(() => {
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    setLoading(true);
    axios
      .get(`${API}/reminders/${dateStr}`)
      .then((res) => {
        setReminders(res.data);
        setLoading(false);
      });
  }, [selectedDate]);

  // Add or Edit a reminder
  const saveReminder = async () => {
    if (!title.trim()) return alert("Please enter a title!");
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");

    if (editingId) {
      // EDIT mode
      const res = await axios.put(`${API}/reminders/${editingId}`, {
        title,
        date: dateStr,
        time: time || null,
        note: note || null,
      });
      setReminders(reminders.map((r) => (r.id === editingId ? res.data : r)));
      setAllReminders(allReminders.map((r) => (r.id === editingId ? res.data : r)));
      setEditingId(null);
    } else {
      // ADD mode
      const res = await axios.post(`${API}/reminders`, {
        title,
        date: dateStr,
        time: time || null,
        note: note || null,
      });
      setReminders([...reminders, res.data]);
      setAllReminders([...allReminders, res.data]);
    }

    setTitle("");
    setTime("");
    setNote("");
  };

  // Fill form with reminder data for editing
  const startEdit = (reminder) => {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setTime(reminder.time || "");
    setNote(reminder.note || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setTime("");
    setNote("");
  };

  // Delete a reminder
  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    await axios.delete(`${API}/reminders/${id}`);
    setReminders(reminders.filter((r) => r.id !== id));
    setAllReminders(allReminders.filter((r) => r.id !== id));
    if (editingId === id) cancelEdit();
  };

  // Show dot on dates that have reminders
  const tileClassName = ({ date }) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const hasReminder = allReminders.some((r) => r.date === dateStr);
    return hasReminder ? "has-reminder" : null;
  };

  return (
    <div className="app">
      <h1>📅 SmartCal</h1>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
      />

      <div className="reminder-panel">
        <h2>
          {dayjs(selectedDate).format("MMMM D, YYYY")}
        </h2>

        {/* Form */}
        <div className="reminder-form">
          <input
            type="text"
            placeholder="Reminder title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
          <div className="form-buttons">
            <button className="btn-add" onClick={saveReminder}>
              {editingId ? "💾 Save Changes" : "+ Add Reminder"}
            </button>
            {editingId && (
              <button className="btn-cancel" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Reminder list */}
        <div className="reminder-list">
          {loading ? (
            <p className="no-reminders">Loading...</p>
          ) : reminders.length === 0 ? (
            <div className="empty-state">
              <p>🗓️</p>
              <p>No reminders for this day.</p>
              <p>Add one above!</p>
            </div>
          ) : (
            reminders.map((r) => (
              <div
                className={`reminder-item ${editingId === r.id ? "editing" : ""}`}
                key={r.id}
              >
                <div className="reminder-info">
                  <h3>{r.title}</h3>
                  <p>
                    {r.time && `⏰ ${r.time}`}
                    {r.time && r.note && " · "}
                    {r.note && `📝 ${r.note}`}
                  </p>
                </div>
                <div className="reminder-actions">
                  <button
                    className="btn-edit"
                    onClick={() => startEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteReminder(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
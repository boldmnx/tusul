'use client'
import { useState, useEffect, useRef } from "react";

const DAYS = ["", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];

function uid() {
  return "id-" + Math.random().toString(36).slice(2, 9);
}

const STORAGE_KEY = "schedule_v1";

export default function Huviar() {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    day: 1,
    start: "09:00",
    end: "10:30",
    location: "",
    color: "#a3e635",
    note: "",
  });

  const ttbodyRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setLessons(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  }, [lessons]);

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      day: 1,
      start: "09:00",
      end: "10:30",
      location: "",
      color: "#a3e635",
      note: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    const newLessons = [...lessons];
    const idx = newLessons.findIndex((x) => x.id === form.id);
    if (idx >= 0) newLessons[idx] = form;
    else newLessons.push({ ...form, id: form.id || uid() });
    setLessons(newLessons);
    resetForm();
  };

  const handleDelete = () => {
    if (!form.id) return;
    setLessons(lessons.filter((x) => x.id !== form.id));
    resetForm();
  };

  const openEditor = (id) => {
    const l = lessons.find((x) => x.id === id);
    if (l) setForm(l);
  };

  const buildHours = () => {
    const hours = [];
    for (let h = 8; h <= 20; h++) hours.push((h < 10 ? "0" + h : h) + ":00");
    return hours;
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "28px auto", padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <h1>Хичээлийн хуваарь</h1>

      <div style={{ display: "flex", gap: "18px", marginTop: "18px" }}>
        {/* Left: timetable */}
        <div style={{ flex: 1, background: "#fff", padding: "12px", borderRadius: "12px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "680px" }}>
            <thead>
              <tr>
                <th>Цаг \ Өдөр</th>
                {DAYS.slice(1).map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody ref={ttbodyRef}>
              {buildHours().map((time) => (
                <tr key={time}>
                  <td style={{ border: "1px solid #eef2ff", padding: "8px", textAlign: "center" }}>{time}</td>
                  {DAYS.slice(1).map((d) => (
                    <td
                      key={d}
                      style={{ border: "1px solid #eef2ff", minHeight: "64px", position: "relative" }}
                    >
                      {lessons
                        .filter((l) => l.day === DAYS.indexOf(d))
                        .map((l) => {
                          const [hStart] = l.start.split(":");
                          if (parseInt(hStart) === parseInt(time.split(":")[0])) {
                            return (
                              <div
                                key={l.id}
                                style={{
                                  position: "absolute",
                                  left: 6,
                                  right: 6,
                                  top: 6,
                                  borderRadius: 8,
                                  padding: "6px 8px",
                                  background: l.color,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontSize: "13px",
                                }}
                                onClick={() => openEditor(l.id)}
                              >
                                {l.title} <br />
                                <span style={{ fontWeight: 400, fontSize: "12px" }}>
                                  {l.start}-{l.end} {l.location ? "• " + l.location : ""}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: form */}
        <div style={{ width: "360px", background: "#fff", padding: "12px", borderRadius: "12px" }}>
          <h3>Шинэ хичээл нэмэх / Засах</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="hidden" value={form.id} />
            <label>Хичээлийн нэр</label>
            <select value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required>
              <option value="">Сонгоно уу</option>
              <option value="Математик">Математик</option>
              <option value="Монгол">Монгол</option>
              <option value="Физик">Физик</option>
              <option value="Код бичлэг">Код бичлэг</option>
              <option value="Спорт">Спорт</option>
              <option value="Биологи">Биологи</option>
            </select>

            <label>Өдөр</label>
            <select value={form.day} onChange={(e) => setForm({ ...form, day: parseInt(e.target.value) })}>
              {DAYS.slice(1).map((d, i) => (
                <option key={i + 1} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>

            <label>Эхлэх</label>
            <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            <label>Дуусах</label>
            <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            <label>Байршил / Танхим</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <label>Өнгө</label>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <label>Тайлбар</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} />

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" style={{ background: "#0ea5a4", color: "white", borderRadius: 8, padding: "8px 12px" }}>
                {form.id ? "Хадгалах" : "Нэмэх"}
              </button>
              <button type="button" onClick={resetForm} style={{ borderRadius: 8, padding: "8px 12px" }}>
                Цэвэрлэх
              </button>
              {form.id && (
                <button type="button" onClick={handleDelete} style={{ borderRadius: 8, padding: "8px 12px" }}>
                  Устгах
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

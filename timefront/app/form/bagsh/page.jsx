"use client";

import { useEffect, useState } from "react";

export default function Bagsh() {
  const [bagsh, setBagsh] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch teachers
  const getTeachers = () => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listTeacher" }),
    })
      .then((res) => res.json())
      .then((data) => setBagsh(data.data));
  };

  useEffect(() => {
    getTeachers();
  }, []);

  // Add / Update teacher
  const saveTeacher = (e) => {
    e.preventDefault();
    const action = editId ? "updateTeacher" : "addTeacher";

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        id: editId,
        name,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setName("");
        setEditId(null);
        getTeachers();
      });
  };

  // Delete teacher
  const deleteTeacher = (id) => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteTeacher", id }),
    }).then(() => getTeachers());
  };

  // Start editing
  const startEdit = (t) => {
    setEditId(t.id);
    setName(t.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Form */}
      <form
        onSubmit={saveTeacher}
        className="bg-white shadow-md rounded px-6 py-4 mb-6 flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Багшийн нэрээ оруулна уу"
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Болих
          </button>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">№</th>
              <th className="py-2 px-4 text-left">Нэр</th>
              <th className="py-2 px-4 text-left">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {bagsh.map((t, i) => (
              <tr
                key={t.id}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">{t.name}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => startEdit(t)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => deleteTeacher(t.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
            {bagsh.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  Багшийн мэдээлэл хоосон байна
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

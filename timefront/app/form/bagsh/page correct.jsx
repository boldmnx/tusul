"use client";

import { useEffect, useState } from "react";

export default function Bagsh() {
  const [bagsh, setBagsh] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch list
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

  // Add or Update
  const saveTeacher = (e) => {
    e.preventDefault();

    const action = editId ? "updateTeacher" : "addTeacher";

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        id: editId,
        name: name,
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
      body: JSON.stringify({
        action: "deleteTeacher",
        id: id,
      }),
    })
      .then((res) => res.json())
      .then(() => getTeachers());
  };

  // Start editing
  const startEdit = (t) => {
    setEditId(t.id);
    setName(t.name);
  };

  return (
    <>
      {/* ADD + EDIT form */}
      <form onSubmit={saveTeacher}>
        <label>Багшийн нэр: </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ border: "1px solid #ccc" }}
          placeholder="Нэрээ оруулна уу"
        />

        <button type="submit" style={{ border: "1px solid gray" }}>
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
            style={{ border: "1px solid gray", marginLeft: "10px" }}
          >
            Болих
          </button>
        )}
      </form>

      <br />

      {/* LIST */}
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 py-2 px-3">№</th>
            <th className="border border-gray-300 py-2 px-3">Нэр</th>
            <th className="border border-gray-300 py-2 px-3">Үйлдэл</th>
          </tr>
        </thead>

        <tbody>
          {bagsh.map((t, i) => (
            <tr key={t.id}>
              <td className="border border-gray-300 py-2 px-3">{i + 1}</td>
              <td className="border border-gray-300 py-2 px-3">{t.name}</td>
              <td className="border border-gray-300 py-2 px-3">
                <button
                  style={{ marginRight: 10 }}
                  onClick={() => startEdit(t)}
                >
                  Засах
                </button>

                <button onClick={() => deleteTeacher(t.id)}>Устгах</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

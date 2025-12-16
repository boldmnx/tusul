"use client";

import { useEffect, useState } from "react";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [roomNumbers, setRoomNumbers] = useState("");
  const [editId, setEditId] = useState(null);

  // Room жагсаалт авах
  const getRooms = () => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listRoom" }),
    })
      .then((r) => r.json())
      .then((d) => setRooms(d.data));
  };

  useEffect(() => {
    getRooms();
  }, []);

  // Room нэмэх / шинэчлэх
  const saveRoom = (e) => {
    e.preventDefault();
    const action = editId ? "updateRoom" : "addRoom";

    // Зөвхөн дугаарын массив үүсгэх, object болгохгүй
    const numbersArray = roomNumbers
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n); // хоосон утга байхгүй болгох

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        id: editId,
        room_type: roomType,
        room_number: numbersArray,
      }),
    }).then(() => {
      setRoomType("");
      setRoomNumbers("");
      setEditId(null);
      getRooms();
    });
  };

  // Room устгах
  const deleteRoom = (id) => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteRoom", id }),
    }).then(() => getRooms());
  };

  // Засах функц
  const startEdit = (r) => {
    setEditId(r.id);
    setRoomType(r.room_type);
    setRoomNumbers(
      Array.isArray(r.room_number) ? r.room_number.join(", ") : ""
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Form */}
      <form
        onSubmit={saveRoom}
        className="bg-white shadow-md rounded px-6 py-4 mb-6 flex flex-col gap-4"
      >
        <select
          className="border p-2 rounded"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option value="">Төрөл сонгох</option>
          <option value="лекц">Лекц</option>
          <option value="лаб">Лаб</option>
          <option value="семинар">Семинар</option>
        </select>

        <input
          type="text"
          placeholder="Өрөөний дугаар: 101, 102, 103"
          className="border p-2 rounded"
          value={roomNumbers}
          onChange={(e) => setRoomNumbers(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4">№</th>
            <th className="py-2 px-4">Төрөл</th>
            <th className="py-2 px-4">Дугаарууд</th>
            <th className="py-2 px-4">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r, i) => (
            <tr key={r.id}>
              <td className="py-2 px-4">{i + 1}</td>
              <td className="py-2 px-4">{r.room_type}</td>
              <td className="py-2 px-4">
                {Array.isArray(r.room_number) ? r.room_number.join(", ") : ""}
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => startEdit(r)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Засах
                </button>
                <button
                  onClick={() => deleteRoom(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Устгах
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

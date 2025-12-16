"use client";

import { useEffect, useState } from "react";

export default function ClassGroup() {
  const [groups, setGroups] = useState([]);
  const [hutulbur, setHutulbur] = useState("");
  const [groupName, setGroupName] = useState("");
  const [damjaa, setDamjaa] = useState("");
  const [editId, setEditId] = useState(null);

  const getGroups = () => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listClassGroup" }),
    })
      .then((r) => r.json())
      .then((d) => setGroups(d.data));
  };

  useEffect(() => {
    getGroups();
  }, []);

  const saveGroup = (e) => {
    e.preventDefault();
    const action = editId ? "updateClassGroup" : "addClassGroup";

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        id: editId,
        hutulbur,
        group_name: groupName,
        damjaa,
      }),
    }).then(() => {
      setHutulbur("");
      setGroupName("");
      setDamjaa("");
      setEditId(null);
      getGroups();
    });
  };

  const deleteGroup = (id) => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteClassGroup", id }),
    }).then(() => getGroups());
  };

  const startEdit = (g) => {
    setEditId(g.id);
    setHutulbur(g.hutulbur);
    setGroupName(g.group_name);
    setDamjaa(g.damjaa);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Form */}
      <form
        onSubmit={saveGroup}
        className="bg-white shadow-md rounded px-6 py-4 mb-6 flex flex-col gap-4"
      >
        <input
          type="text"
          value={hutulbur}
          onChange={(e) => setHutulbur(e.target.value)}
          placeholder="Хөтөлбөр"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Бүлэг"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={damjaa}
          onChange={(e) => setDamjaa(e.target.value)}
          placeholder="Дамжаа"
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4">№</th>
            <th className="py-2 px-4">Хөтөлбөр</th>
            <th className="py-2 px-4">Бүлэг</th>
            <th className="py-2 px-4">Дамжаа</th>
            <th className="py-2 px-4">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={g.id}>
              <td className="py-2 px-4">{i + 1}</td>
              <td className="py-2 px-4">{g.hutulbur}</td>
              <td className="py-2 px-4">{g.group_name}</td>
              <td className="py-2 px-4">{g.damjaa}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => startEdit(g)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Засах
                </button>
                <button
                  onClick={() => deleteGroup(g.id)}
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

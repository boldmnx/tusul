"use client";

import { useEffect, useState } from "react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [editId, setEditId] = useState(null);

  const MULTI_ROOM = ["лекц", "лаб", "семинар"];

  const getData = () => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listCourse" }),
    })
      .then((r) => r.json())
      .then((d) => setCourses(d.data));

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listTeacher" }),
    })
      .then((r) => r.json())
      .then((d) => setTeachers(d.data));

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "listGroup" }),
    })
      .then((r) => r.json())
      .then((d) => setGroups(d.data));
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleRoomType = (rt) => {
    if (roomTypes.includes(rt)) {
      setRoomTypes(roomTypes.filter((x) => x !== rt));
    } else {
      setRoomTypes([...roomTypes, rt]);
    }
  };

  const toggleGroup = (id) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };

  const saveCourse = (e) => {
    e.preventDefault();
    const action = editId ? "updateCourse" : "addCourse";

    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        id: editId,
        name,
        teacher: teacherId,
        lesson_type: lessonType,
        available_room_types: roomTypes,
        group_list: selectedGroups,
      }),
    }).then(() => {
      setName("");
      setTeacherId("");
      setLessonType("");
      setRoomTypes([]);
      setSelectedGroups([]);
      setEditId(null);
      getData();
    });
  };

  const deleteCourse = (id) => {
    fetch("http://127.0.0.1:8000/service/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteCourse", id }),
    }).then(() => getData());
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <form
        onSubmit={saveCourse}
        className="bg-white shadow rounded p-6 mb-6 flex flex-col gap-4"
      >
        <input
          className="border p-2 rounded"
          value={name}
          placeholder="Хичээлийн нэр"
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">Багш сонгох</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          value={lessonType}
          placeholder="Хичээлийн төрөл (лекц/лаб/семинар)"
          onChange={(e) => setLessonType(e.target.value)}
        />

        {/* Room Types multi select */}
        <div className="flex gap-3">
          {MULTI_ROOM.map((rt) => (
            <label key={rt} className="border p-2 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={roomTypes.includes(rt)}
                onChange={() => toggleRoomType(rt)}
              />
              <span className="ml-2">{rt}</span>
            </label>
          ))}
        </div>

        {/* Groups multi select */}
        <div className="grid grid-cols-2 gap-2 border p-3 rounded">
          {groups.map((g) => (
            <label key={g.id} className="p-2 border rounded">
              <input
                type="checkbox"
                checked={selectedGroups.includes(g.id)}
                onChange={() => toggleGroup(g.id)}
              />
              <span className="ml-2">
                {g.hutulbur} - {g.group_name}
              </span>
            </label>
          ))}
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4">№</th>
            <th className="py-2 px-4">Нэр</th>
            <th className="py-2 px-4">Багш</th>
            <th className="py-2 px-4">Төрөл</th>
            <th className="py-2 px-4">Өрөө</th>
            <th className="py-2 px-4">Ангийн тоо</th>
            <th className="py-2 px-4">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, i) => (
            <tr key={c.id}>
              <td className="py-2 px-4">{i + 1}</td>
              <td className="py-2 px-4">{c.name}</td>
              <td className="py-2 px-4">{c.teacher}</td>
              <td className="py-2 px-4">{c.lesson_type}</td>
              <td className="py-2 px-4">{c.available_room_types.join(", ")}</td>
              {/* <td className="py-2 px-4">{c.group_list.length}</td> */}
              <td className="py-2 px-4">{c.group_list?.length || 0}</td>

              <td className="py-2 px-4 flex gap-2">
                <button className="bg-yellow-400 text-white px-3 py-1 rounded">
                  Засах
                </button>
                <button
                  onClick={() => deleteCourse(c.id)}
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

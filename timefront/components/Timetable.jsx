"use client";
import React, { useEffect, useState } from "react";
import scheduleData from "@/app/api/data.json";

const Timetable = () => {
  // const data = scheduleData[0].entries;

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData[0].entries); // backend бүтэц
      })
      .catch((err) => console.error(err));
  }, []);

  if (!data.length) return <p>Ачааллаж байна...</p>;

  const dayMap = {
    Mon: "Даваа",
    Tue: "Мягмар",
    Wed: "Лхагва",
    Thu: "Пүрэв",
    Fri: "Баасан",
  };

  const groupedByDay = data.reduce((acc, item) => {
    const day = dayMap[item.day] || item.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const orderedDays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];

  const groupsList = [
    "Мэдээллийн систем (1-1)",
    "Программ хангамж (1-1)",
    "Программ хангамж (1-2)",

    "Программ хангамж (2-1)",
    "Мэдээллийн систем (2-1)",

    "Мэдээллийн систем (3-1)",
    "Программ хангамж (3-1)",

    "Мэдээллийн систем (4-1)",
    "Программ хангамж (4-1)",
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden mt-10">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-2 px-3">Өдөр</th>
              <th className="border border-gray-300 py-2 px-3">Цаг</th>
              {groupsList.map((g) => (
                <th key={g} className="border border-gray-300 py-2 px-3">
                  {g}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderedDays.map((day) => {
              const lessons = groupedByDay[day] || [];

              // Цагаар бүлэглэх
              const groupedByTime = lessons.reduce((acc, l) => {
                if (!acc[l.time]) acc[l.time] = [];
                acc[l.time].push(l);
                return acc;
              }, {});
              const times = Object.keys(groupedByTime);

              return times.map((time, i) => {
                const timeLessons = groupedByTime[time];

                // --- 1️⃣ Давхардлыг нэгтгэх хэсэг ---
                const uniqueLessons = [];
                timeLessons.forEach((l) => {
                  const existing = uniqueLessons.find(
                    (u) =>
                      u.course_name === l.course_name &&
                      u.lesson_type === l.lesson_type &&
                      u.room === l.room &&
                      u.teacher === l.teacher
                  );
                  if (existing) {
                    existing.groups = [
                      ...new Set([...existing.groups, ...l.groups]),
                    ];
                  } else {
                    uniqueLessons.push({ ...l });
                  }
                });

                return (
                  <tr
                    key={`${day}-${time}`}
                    className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    {i === 0 && (
                      <td
                        rowSpan={times.length}
                        className="border border-gray-300 text-center font-semibold bg-gray-50"
                      >
                        {day}
                      </td>
                    )}
                    <td className="border border-gray-300 py-2 px-2 whitespace-nowrap">
                      {time}
                    </td>

                    {groupsList.map((group, colIdx) => {
                      // Хичээл энэ бүлэгт орсон эсэх
                      const lesson = uniqueLessons.find((l) =>
                        l.groups.includes(group)
                      );

                      // colSpan тооцох (ижил хичээл хэдэн дараалсан бүлэгт орсон)
                      if (lesson && !lesson.rendered) {
                        const startIdx = groupsList.indexOf(group);
                        const consecutiveCount = groupsList
                          .slice(startIdx)
                          .reduce((count, g) => {
                            if (lesson.groups.includes(g)) return count + 1;
                            return count;
                          }, 0);

                        // нэгтгэсэн мөрийг нэг л удаа зурна
                        lesson.rendered = true;

                        return (
                          <td
                            key={group}
                            colSpan={consecutiveCount}
                            className="border border-gray-300 bg-blue-100 px-2 text-center font-medium"
                          >
                            {lesson.course_name} ({lesson.lesson_type}) <br />
                            {lesson.room} <br />
                            {lesson.teacher}
                          </td>
                        );
                      }

                      // аль хэдийн нэгтгэгдсэн бол хоосон буцаана
                      if (lesson && lesson.rendered) return null;

                      // энэ бүлэгт хичээл байхгүй бол хоосон нүд
                      return (
                        <td
                          key={group}
                          className="border border-gray-300 px-2"
                        ></td>
                      );
                    })}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;

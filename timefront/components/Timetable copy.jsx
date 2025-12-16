"use client";
import React from "react";
import scheduleData from "@/app/api/data.json";

const Timetable = () => {
  const data = scheduleData[0].entries; // JSON-ийн entries хэсгийг авна

  // Монгол хэл рүү хөрвүүлэх
  const dayMap = {
    Mon: "Даваа",
    Tue: "Мягмар",
    Wed: "Лхагва",
    Thu: "Пүрэв",
    Fri: "Баасан",
  };

  // Өдөр тус бүрийн хичээлүүдийг бүлэглэнэ
  const groupedByDay = data.reduce((acc, item) => {
    const day = dayMap[item.day] || item.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  // Өдрийн нэрийн дарааллаар эрэмбэлнэ
  const orderedDays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden mt-10">
      {/* <h2 className="text-2xl md:text-3xl font-bold text-center py-5 border-b border-gray-300">
        Мэдээллийн систем, Программ хангамж
      </h2> */}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th colSpan={2} className="border border-gray-300 py-2 px-3"></th>
              <th colSpan={3} className="border border-gray-300 py-2 px-3">
                Хоёрдугаар курс
              </th>
              <th colSpan={2} className="border border-gray-300 py-2 px-3">
                Нэгдүгээр курс
              </th>
              <th colSpan={2} className="border border-gray-300 py-2 px-3">
                Гуравдугаар курс
              </th>
              <th colSpan={2} className="border border-gray-300 py-2 px-3">
                Дөрөвдүгээр курс
              </th>
            </tr>
            <tr>
              <th className="border border-gray-300 py-2 px-3">Өдөр</th>
              <th className="border border-gray-300 py-2 px-3">Цаг</th>
              <th className="border border-gray-300 py-2 px-3">
                Программ хангамж (2-1)
              </th>

              <th className="border border-gray-300 py-2 px-3">
                Программ хангамж (2-2)
              </th>
              <th className="border border-gray-300 py-2 px-3">
                Мэдээллийн систем (2-1)
              </th>

              <th className="border border-gray-300 py-2 px-3">
                Мэдээллийн систем (1-1)
              </th>

              <th className="border border-gray-300 py-2 px-3">
                Программ хангамж (1-1)
              </th>

              <th className="border border-gray-300 py-2 px-3">
                Мэдээллийн систем (3-1)
              </th>
              <th className="border border-gray-300 py-2 px-3">
                Программ хангамж (3-1)
              </th>
              <th className="border border-gray-300 py-2 px-3">
                Мэдээллийн систем (4-1)
              </th>
              <th className="border border-gray-300 py-2 px-3">
                Программ хангамж (4-1)
              </th>
            </tr>
          </thead>
          <tbody>
            {orderedDays.map((day) => {
              const lessons = groupedByDay[day] || [];
              return lessons.length > 0
                ? lessons.map((row, i) => (
                    <tr
                      key={`${day}-${i}`}
                      className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      {i === 0 && (
                        <td
                          rowSpan={lessons.length}
                          className="border border-gray-300 text-center font-semibold bg-gray-50"
                        >
                          {day}
                        </td>
                      )}
                      <td className="border border-gray-300 py-2 px-2 whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="border border-gray-300 px-2">
                        {row.course_name} ({row.lesson_type}) <br />
                        {row.room} <br />
                        {row.teacher}
                      </td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                      <td className="border border-gray-300 px-2"></td>
                    </tr>
                  ))
                : null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;

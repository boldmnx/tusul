"use client";
import { useEffect, useState } from "react";

type Entry = {
  day: string;
  time: string;
  room: string;
  teacher: string;
  course: string;
  session: string;
  groups: string[];
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Entry[][]>([]);

  useEffect(() => {
    // Жишээ mock дата
    const tempData: Entry[][] = [
      [
        {
          day: "Mon",
          time: "08:00-09:30",
          room: "102",
          teacher: "Бадмаа",
          course: "Вебийн үндэс",
          session: "лекц",
          groups: ["1-1", "1-2", "1-3"],
        },
        {
          day: "Tue",
          time: "09:40-11:10",
          room: "302",
          teacher: "Бадмаа",
          course: "Вебийн үндэс",
          session: "лаб",
          groups: ["1-1"],
        },
      ],
    ];
    setSchedules(tempData);
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = [
    "08:00-09:30",
    "09:40-11:10",
    "11:20-12:50",
    "13:00-14:30",
    "14:40-16:10",
    "16:20-17:50",
  ];

  // тухайн өдөр, цагийн cell дотор орох хичээл авах функц
  function getCellContent(schedule: Entry[], day: string, time: string) {
    const entry = schedule.find((e) => e.day === day && e.time === time);
    if (!entry) return null;
    return (
      <div className="p-1 text-sm  rounded">
        <p className="font-semibold">
          {entry.course} ({entry.session})
        </p>
        <p>Өрөө: {entry.room}</p>
        <p>Багш: {entry.teacher}</p>
        <p>Анги: {entry.groups.join(", ")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Хичээлийн хуваарь</h1>

      {schedules.map((schedule, idx) => (
        <div key={idx} className="mb-10">
          <h2 className="font-semibold text-lg mb-2">Хуваарь {idx + 1}</h2>
          <table className="border-collapse border border-gray-400 w-full text-center">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Цаг</th>
                {days.map((day) => (
                  <th key={day} className="border border-gray-400 p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time}>
                  <td className="border border-gray-400 p-2 font-medium">
                    {time}
                  </td>
                  {days.map((day) => (
                    <td
                      key={day}
                      className="border border-gray-300 p-2 align-top min-w-[150px]"
                    >
                      {getCellContent(schedule, day, time)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

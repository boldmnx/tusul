'use client'

import { useEffect, useState } from "react";

export default function AutoSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/auto_schedule/",{
        cache: "no-store"  // Энэ мөрийг нэмнэ

    })
      .then((res) => res.json())
      .then((data) => setSchedule(data));
  }, []);

  return (
    <div>
      <h1>Автомат Хуваарь</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Хичээл</th>
            <th>Багш</th>
            <th>Өдөр</th>
            <th>Цаг</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.course}</td>
              <td>{item.teacher}</td>
              <td>{item.day}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

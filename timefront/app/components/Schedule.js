// components/Schedule.js
import React from 'react';

const Schedule = ({ schedule }) => {

    if (!schedule || !Array.isArray(schedule[0].entries)) {
        return <p>Хуваарь олдсонгүй эсвэл буруу форматтай байна.</p>;
      }
      
  // Өдөр тус бүрээр бүлэглэх
  const scheduleByDay = schedule[0].entries.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {});

  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="schedule-container">
      {dayOrder.map((day) => (
        <div key={day} className="day-section">
          <h2>{day}</h2>
          {scheduleByDay[day] ? (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Цаг</th>
                  <th>Хичээл</th>
                  <th>Төрөл</th>
                  <th>Өрөө</th>
                  <th>Багш</th>
                  <th>Бүлгүүд</th>
                </tr>
              </thead>
              <tbody>
                {scheduleByDay[day].map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.time}</td>
                    <td>{entry.course_name}</td>
                    <td>{entry.lesson_type}</td>
                    <td>{entry.room}</td>
                    <td>{entry.teacher}</td>
                    <td>{entry.groups.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Хичээл алга</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Schedule;

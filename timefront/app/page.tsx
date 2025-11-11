// pages/index.js
import React from 'react';
import Schedule from './components/Schedule';
import scheduleData from './api/data.json'; // таны JSON файлыг энд импортлох

export default function Home() {
  return (
    <div>
      <h1>Миний Хуваарь</h1>
      <Schedule schedule={scheduleData} />
    </div>
  );
}

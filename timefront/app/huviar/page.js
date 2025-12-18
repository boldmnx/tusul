"use client";

import { useState } from "react";
import Timetable from "@/components/Timetable";
import Spinner from "@/components/Spinner";

export default function TimetablePage() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setShow(false); // ✅ өмнөх хуваарийг бүрэн устгана

    setTimeout(() => {
      setShow(true); // ✅ Timetable шинээр mount хийнэ
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6 p-6">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow
                   hover:bg-blue-700 transition disabled:opacity-60"
      >
        📅 Хуваарь гаргах
      </button>

      {loading && <Spinner />}

      {show && (
        // <div className="p-4 bg-white text-black">
          <Timetable />
        // </div>
      )}
    </div>
  );
}

// src/components/mypage/ProfileStats.jsx
import React from 'react';

export default function ProfileStats({ stats }) {
  return (
    <div className="space-y-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="w-full flex justify-between border px-4 py-3 rounded-xl font-semibold" // px-6을 px-4로 변경
        >
          <span>{item.label}</span>
          <span className="text-gray-400">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
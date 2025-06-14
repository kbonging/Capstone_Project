// src/components/mypage/ProfileStats.jsx
import React from 'react';

export default function ProfileStats({ stats }) {
  return (
    <div className="space-y-2">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="w-full flex justify-between border px-4 py-2 rounded"
        >
          <span>{item.label}</span>
          <span className={item.status ? 'text-gray-400' : ''}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

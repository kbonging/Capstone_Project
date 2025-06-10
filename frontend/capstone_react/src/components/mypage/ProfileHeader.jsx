import React from 'react';

export default function ProfileHeader({ name, role }) {
  return (
    <div className="flex items-center space-x-6 mb-6">
      {/* 아바타 */}
      <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
        <i className="fas fa-user"></i>
      </div>
      {/* 이름/역할 */}
      <div className="space-y-1">
        <div className="text-sm text-gray-400">{role}</div>
        <h2 className="text-2xl font-bold">{name}</h2>
      </div>
    </div>
  );
}

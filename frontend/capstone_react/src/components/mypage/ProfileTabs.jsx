// src/components/mypage/ProfileTabs.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ProfileTabs() {
  return (
    <div className="flex border-b text-xl font-semibold space-x-6 mb-8 w-max px-1">
      <NavLink
        to="/mypage"
        end
        className={({ isActive }) =>
          isActive
            ? 'pb-2 text-black font-bold border-b-2 border-blue-500'
            : 'pb-2 text-gray-400'
        }
      >
        프로필
      </NavLink>

      <NavLink
        to="/mypage/manage"
        className={({ isActive }) =>
          isActive
            ? 'pb-2 text-black font-bold border-b-2 border-blue-500'
            : 'pb-2 text-gray-400'
        }
      >
        프로필 관리
      </NavLink>
    </div>
  );
}

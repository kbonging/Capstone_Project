import React from "react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

export default function Step3({ formData, setFormData }) {
  const toggleDay = (day) => {
    const selected = formData.expDay || [];
    if (selected.includes(day)) {
      setFormData({ ...formData, expDay: selected.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, expDay: [...selected, day] });
    }
  };

  return (
    <div className="space-y-6">
      {/* 요일 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          체험 가능 요일
        </label>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-full border ${
                formData.expDay?.includes(day)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 체험 시간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작 시간
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료 시간
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
      </div>

      {/* 예약 안내 사항 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          예약 안내 사항(선택)
        </label>
        <textarea
          value={formData.reservationNotice}
          onChange={(e) =>
            setFormData({ ...formData, reservationNotice: e.target.value })
          }
          placeholder="예: 최소 하루 전 예약 필요, 당일 취소 불가 등"
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          rows={3}
        />
      </div>
    </div>
  );
}

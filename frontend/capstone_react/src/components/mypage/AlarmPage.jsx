import { useState } from "react";

export default function AlarmPage() {
  const [tab, setTab] = useState("unread");

  // 더미용 데이터임 김봉중 알아서ㅎㅅ
  const dummyAlarms = [
    { id: 1, message: "체험단 신청이 승인되었습니다.", date: "2025-09-12", read: false },
    { id: 2, message: "새로운 댓글이 달렸습니다.", date: "2025-09-11", read: true },
    { id: 3, message: "포인트가 적립되었습니다.", date: "2025-09-10", read: false },
  ];

  const filteredAlarms =
    tab === "unread" ? dummyAlarms.filter((a) => !a.read) : dummyAlarms;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 border-b pb-2 mb-4">
        <button
          onClick={() => setTab("unread")}
          className={`pb-1 border-b-2 ${
            tab === "unread"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          읽지 않은 알림
        </button>
        <button
          onClick={() => setTab("all")}
          className={`pb-1 border-b-2 ${
            tab === "all"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          모든 알림
        </button>
      </div>

      {/* 알림 리스트 */}
      {filteredAlarms.length === 0 ? (
        <div className="text-gray-500 py-10 text-center">
          읽지 않은 알림이 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredAlarms.map((alarm) => (
            <li
              key={alarm.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <span>{alarm.message}</span>
              <span className="text-sm text-gray-400">{alarm.date}</span>
            </li>
          ))}
        </ul>
      )}

      {/* 하단 안내 */}
      <div className="flex justify-between items-center mt-12 text-sm">
        <span className="text-red-500">
          90일이 지난 알림은 자동으로 정리 됩니다
        </span>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">
          모두 읽음
        </button>
      </div>
    </div>
  );
}

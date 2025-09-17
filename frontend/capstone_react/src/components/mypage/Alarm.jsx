// src/components/mypage/Alarm.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { AppContext } from "../../contexts/AppContext";
import { fetchUserNotifications, markAlarmAsRead } from "../../api/commonApi"; // 경로 맞게 조정


export default function Alarm() {
  const [tab, setTab] = useState("unread");
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { unreadCount, setUnreadCount, token } = useContext(AppContext);

  // 🔹 알림 클릭 시 읽음 처리
  const handleClickAlarm = async (alarm) => {
    if (alarm.isRead) return; // 이미 읽음이면 스킵
    try {
      await markAlarmAsRead(alarm.notificationIdx);

      // 1) 로컬 state 업데이트
      setAlarms((prev) =>
        prev.map((a) =>
          a.notificationIdx === alarm.notificationIdx
            ? { ...a, isRead: true }
            : a
        )
      );
      // 2) Context unreadCount 업데이트
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("읽음 처리 실패:", err);
    }
    navigate("/mypage/my-campaigns");
  };

  // 🔹 알림 불러오기
  useEffect(() => {
    if (!token) return; // 로그인 안하면 스킵
    async function loadAlarms() {
      try {
        setLoading(true);
        const data = await fetchUserNotifications(token);
        setAlarms(data.alarmList || []);
      } catch (err) {
        console.error("알림 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAlarms();
  }, [token]);

  // 🔹 탭 필터 적용
  const filteredAlarms =
    tab === "unread" ? alarms.filter((a) => !a.isRead) : alarms;

  return (
    <div className="p-6">
      {/* 탭 */}
      <div className="flex items-center gap-4 border-b pb-2 mb-4">
        <button
          onClick={() => setTab("unread")}
          className={`pb-1 border-b-2 ${
            tab === "unread"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          읽지 않은 알림 ({alarms.filter(a => !a.isRead).length})
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
      {loading ? (
        <div className="text-gray-500 py-10 text-center">불러오는 중...</div>
      ) : error ? (
        <div className="text-red-500 py-10 text-center">{error}</div>
      ) : filteredAlarms.length === 0 ? (
        <div className="text-gray-500 py-10 text-center">
          {tab === "unread" ? "읽지 않은 알림이 없습니다." : "알림이 없습니다."}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredAlarms.map((alarm) => (
            <li
              key={alarm.notificationIdx}
              className="p-4 border rounded-lg flex justify-between items-center cursor-pointer"
              onClick={() => handleClickAlarm(alarm)}
            >
              <div className="flex items-center gap-2">
                <div className="font-medium">{alarm.notiTitle}</div>
                {!alarm.isRead && (
                  <span className="text-xs bg-red-500 text-white px-1 rounded">
                    N
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {alarm.regDate}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 하단 안내 */}
      <div className="flex justify-between items-center mt-12 text-sm">
        <span className="text-red-500">
          90일이 지난 알림은 자동으로 정리 됩니다
        </span>
        <button
          className="px-4 py-2 border rounded hover:bg-gray-100"
          onClick={() => {
            // 모두 읽음 처리
            alarms.forEach((alarm) => handleClickAlarm(alarm));
          }}
        >
          모두 읽음
        </button>
      </div>
    </div>
  );
}

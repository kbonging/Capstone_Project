// /src/api/commonApi.js
import axios from "axios";

// 공통 코드 조회
export async function fetchCommonCode(groupCode) {
    const res = await fetch(`/api/common/code/${groupCode}`,{
      method:'GET',
      headers:{
        "Accept":"application/json"
      }
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '공통코드 불러오는 데 실패했습니다.');
    }

    return res.json();
}

/** 
 * 알림 전체 내역 조회
 */ 
export async function fetchUserNotifications() {
  const token = localStorage.getItem("token");

  const res = await axios.get("/api/notifications/alarm", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  return res.data;
}

/** 알림 읽음 처리 */ 
export async function markAlarmAsRead(notificationIdx) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/notifications/mark-read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationIdx }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "읽음 처리 실패");
    throw new Error(err);
  }

  return res.text(); // 문자열 그대로 반환
}

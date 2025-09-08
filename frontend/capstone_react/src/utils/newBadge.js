// src/utils/newBadge.js
const KEY = "myCampaignSeen_v1";

// "2025-09-06 17:57:07" → Date
export function toDate(ts) {
  if (!ts) return null;
  // "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ss"
  return new Date(String(ts).replace(" ", "T"));
}

// (A) 시간 기준: 최근 48시간 이내면 true
export function isNewByTime(item, hours = 48) {
  const base = toDate(item.modDate || item.regDate);
  if (!base) return false;
  const diffHours = (Date.now() - base.getTime()) / 36e5;
  return diffHours <= hours;
}

// (B) 읽음 기준: localStorage에 저장된 마지막 확인 시점보다 최신이면 true
export function hasUnread(item) {
  const raw = localStorage.getItem(KEY);
  const seenMap = raw ? JSON.parse(raw) : {};
  const lastSeenAt = seenMap[item.applicationIdx]; // number (ms)
  const updatedAt = (toDate(item.modDate || item.regDate)?.getTime()) || 0;
  return !lastSeenAt || lastSeenAt < updatedAt;
}

// 상세/카드 열었을 때 호출해서 "읽음 처리"
export function markSeen(applicationIdx) {
  const raw = localStorage.getItem(KEY);
  const seenMap = raw ? JSON.parse(raw) : {};
  seenMap[applicationIdx] = Date.now();
  localStorage.setItem(KEY, JSON.stringify(seenMap));
}

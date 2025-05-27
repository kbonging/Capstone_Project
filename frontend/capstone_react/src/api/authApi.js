// src/api/authApi.js
export async function loginUser({ email, password }) {
  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    // 400/401 같은 에러 응답일 때
    const err = await res.json();
    throw new Error(err.message || "로그인 실패");
  }
  // { token: '...', user: { id, name, ... } }
  return res.json();
}

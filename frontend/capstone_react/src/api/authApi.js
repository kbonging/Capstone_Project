
// 로그인 (토큰 발급)
export async function loginUser({ memberId, memberPwd }) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, memberPwd }),
  });

  if (!res.ok) {
    const errorText = await res.text(); // Spring은 에러 메시지를 JSON으로 주지 않을 수 있음
    throw new Error(errorText || "로그인 실패");
  }

  // ✅ JWT 추출: 응답 헤더에서 Authorization 읽기
  const authHeader = res.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("JWT 토큰이 없습니다.");
  }

  const token = authHeader.replace("Bearer ", "");

  // 필요 시: 토큰을 localStorage 또는 전역 상태에 저장
  localStorage.setItem("token", token);
  return { token }; // 원하면 사용자 정보도 추출해서 여기에 추가 가능
}

// 토큰으로 회원 정보 가져오기
export async function fetchUser(token){
  const res = await fetch("/api/members/info", {
    headers:{
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  return res.json();
}

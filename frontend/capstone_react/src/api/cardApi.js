// 카드 리스트를 카테고리별로 가져오는 함수
export async function fetchCards(category) {
  const res = await fetch(`http://localhost:4000/cards?category=${category}`); //api/cards?category=${category}
  if (!res.ok) throw new Error('카드 조회 실패');
  return res.json();  // 서버가 [{ id, name, description, ... }, …] 형태로 반환한다고 가정
}

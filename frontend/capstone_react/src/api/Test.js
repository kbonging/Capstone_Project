export async function testApiRequest() {
    const res = await fetch(`http://localhost:8080/api/test`); 
    if (!res.ok) throw new Error('조회 실패');
    return res.json();
}
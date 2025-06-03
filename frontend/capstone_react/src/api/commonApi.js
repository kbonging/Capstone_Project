// /src/api/commonApi.js

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
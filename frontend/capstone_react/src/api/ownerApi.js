import axios from "axios";

// 소상공인 회원가입입
export function signUpOwner(formData) {
    return axios.post("/api/owner", formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function checkDuplicateId(memberId) {
    try {
      const response = await axios.get(`/api/members/check-id/${memberId}`); // 백엔드 컨트롤러의 URL
      return response.data; // true 또는 false를 반환
    } catch (error) {
      console.error("ID 중복 확인 중 오류 발생:", error);
      throw error;
    }
  }
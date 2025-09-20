import axios from "axios";

/** MemberIdx로 회원 조회 */
export const getUserByIdx = async (memberIdx, token) => {
    const res = await axios.get(`/api/members/${memberIdx}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

/** 회원 정보 수정 */
export const updateMember = async (memberData, token) => {
  try {
    const response = await axios.put(
      "/api/members",
      memberData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 토큰 필수
        },
      }
    );

    return response.data; // "SUCCESS" or "FAIL" 등
  } catch (error) {
    console.error("회원 정보 수정 오류:", error.response?.data || error.message);
    throw error;
  }
};

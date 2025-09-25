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

/** 회원 정보 수정 (파일 포함) */
export const updateMember = async (memberData, file, token) => {
  try {
    const fd = new FormData();

    // JSON 데이터를 Blob으로 감싸서 추가
    fd.append(
      "request",
      new Blob([JSON.stringify(memberData)], { type: "application/json" })
    );

    // 파일 추가
    if (file) {
      fd.append("file", file);
    }

    const response = await axios.put("/api/members", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("회원 정보 수정 오류:", error.response?.data || error.message);
    throw error;
  }
};

/** 회원 탈퇴 */
export function deleteMember(token) {
  return axios.patch("/api/members", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
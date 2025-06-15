import axios from "axios";

// 리뷰어 회원가입
export function signUpReviewer(formData) {
    return axios.post("/api/reviewer", formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
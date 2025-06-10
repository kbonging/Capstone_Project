import axios from "axios";

export function signUpOwner(formData) {
    return axios.post("/api/owner", formData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}
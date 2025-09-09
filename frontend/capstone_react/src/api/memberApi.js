import axios from "axios";

export const getUserByIdx = async (memberIdx, token) => {
    const res = await axios.get(`/api/members/${memberIdx}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

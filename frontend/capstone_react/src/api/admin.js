import axios from "axios";

export const closeExpiredCampaigns = async (token) => {
    try {
        const response = await axios.post(
            "/api/admin/campaigns/close-expired",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error("만료 캠페인 종료 처리 실패: ", err);
        throw err;
    }
};
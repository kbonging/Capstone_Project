import axios from "axios";

/** 만료 캠페인 종료 */
export const closeExpiredCampaigns = async (token) => {
    try {
        const response = await axios.put(
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
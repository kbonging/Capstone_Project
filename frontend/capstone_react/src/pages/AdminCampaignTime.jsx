import { useContext, useState } from "react";
import MyPageLayout from "../components/mypage/MyPageLayout";
import { AppContext } from '../contexts/AppContext';
import { closeExpiredCampaigns } from "../api/admin";

export default function AdminCampaignTime() {
  const { user, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const getUserRole = (user) => {
    if (user && user.authDTOList && user.authDTOList.length > 0) {
      return user.authDTOList[0].auth;
    }
    return null;
  };

  const userRole = getUserRole(user);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  const handleCloseExpired = async () => {
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    setLoading(true);
    setResult("");
    try {
      const res = await closeExpiredCampaigns(token); // 토큰 넘기기
      setResult(res.message || "만료 캠페인 상태가 업데이트되었습니다.");
    } catch (err) {
      setResult("오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPageLayout userRole={userRole}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">만료 캠페인 종료</h2>
        <button
          onClick={handleCloseExpired}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "처리 중..." : "만료 캠페인 종료"}
        </button>
        {result && <p className="mt-2 text-gray-700">{result}</p>}
      </div>
    </MyPageLayout>
  );
}

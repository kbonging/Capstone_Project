import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { getApplicantsByCampaign, updateApplicantsStatus } from "../../api/campaigns/api";

export default function OwnerCampaignApply({ campaignIdx, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const { token } = useContext(AppContext);

  useEffect(() => {
    if (!campaignIdx) return;
    getApplicantsByCampaign(campaignIdx)
      .then((data) => setApplicants(data))
      .catch((err) => console.error(err));
  }, [campaignIdx]);

  const handleStatusChange = (applicationIdx, newStatus) => {
    updateApplicantsStatus(applicationIdx, newStatus, token)
      .then(() => {
        setApplicants((prev) =>
          prev.map((app) =>
            app.applicationIdx === applicationIdx
              ? { ...app, applyStatusName: newStatus === "CAMAPP_APPROVED" ? "당첨" : "탈락" }
              : app
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[600px] max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">신청자 관리</h2>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-blue-50">
            <tr className="text-center text-gray-600 uppercase text-xs tracking-wide">
              <th className="py-3 border-b">닉네임</th>
              <th className="py-3 border-b">신청 한마디</th>
              <th className="py-3 border-b">상태</th>
              <th className="py-3 border-b">관리</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.applicationIdx} className="text-center border-b hover:bg-blue-50 transition">
                <td className="py-2">{app.nickname}</td>
                <td className="py-2">{app.applyReason}</td>
                <td className="py-2 font-medium">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.applyStatusName === "대기"
                            ? "bg-gray-100 text-gray-600"
                            : app.applyStatusName === "당첨"
                            ? "bg-blue-100 text-blue-600"
                            : app.applyStatusName === "탈락"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {app.applyStatusName}
                    </span>
                </td>
                <td className="py-2 flex justify-center gap-2">
                    <button
                    onClick={() => handleStatusChange(app.applicationIdx, "CAMAPP_APPROVED")}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-xs hover:bg-blue-200 transition"
                    >
                    당첨
                    </button>
                    <button
                    onClick={() => handleStatusChange(app.applicationIdx, "CAMAPP_REJECTED")}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs hover:bg-red-200 transition"
                    >
                    탈락
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

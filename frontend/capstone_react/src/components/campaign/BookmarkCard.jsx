import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "../../utils/url";
import { FiX } from "react-icons/fi";

export default function BookmarkCard({ campaign }) {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const today = new Date();
  const applyEnd = new Date(campaign.applyEndDate);
  today.setHours(0, 0, 0, 0);
  applyEnd.setHours(0, 0, 0, 0);
  const isExpired = today > applyEnd;

  const goToDetail = () => {
    if (isExpired) {
      setToastMsg("마감된 캠페인입니다.");
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2500);
      return;
    }
    navigate(`/campaign/${campaign.campaignIdx}`);
  };

  /** Toast 컴포넌트 */
  const Toast = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-lg
                        dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          {children}
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-stone-100 dark:hover:bg-zinc-800"
          >
            <FiX />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        {toastMsg}
      </Toast>

      <div
        className="border rounded p-2 relative cursor-pointer flex flex-col hover:shadow-lg transition-shadow duration-200"
        onClick={goToDetail}
      >
        <img
          src={toAbsoluteUrl(campaign.thumbnailUrl)}
          alt={campaign.title}
          className={`w-full h-32 object-cover rounded ${isExpired ? "filter grayscale" : ""}`}
        />
        {isExpired && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
            마감
          </div>
        )}

        <h2 className="mt-2 text-sm font-medium">{campaign.title}</h2>
        <p className="text-xs text-gray-500">
          {campaign.campaignTypeName} / {campaign.categoryName}
        </p>
        {campaign.benefitDetail && (
          <p className="text-xs text-gray-600 mt-1 truncate">{campaign.benefitDetail}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">마감: {campaign.applyEndDate}</p>
      </div>
    </>
  );
}

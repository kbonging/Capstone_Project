// src/components/mypage/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import ProfileStats from "./ProfileStats";
import ProfileChannels from "./ProfileChannels";
import { getOngoingCampaigns, getCompletedCampaigns } from "../../api/campaigns/api";
import { AppContext } from "../../contexts/AppContext";
import { toAbsoluteUrl } from "../../utils/url";

export default function Profile({ user }) {
  const { token } = useContext(AppContext);
  const userRole = user?.authDTOList?.[0]?.auth;

  const [activeTab, setActiveTab] = useState("진행중");
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [ongoingHasMore, setOngoingHasMore] = useState(true);
  const [completedHasMore, setCompletedHasMore] = useState(true);

  const nameToDisplay =
    userRole === "ROLE_OWNER"
      ? user.businessName || "미등록"
      : user.nickname || "미등록";
  const profileImg = user.profileImgUrl
    ? toAbsoluteUrl(user.profileImgUrl)
    : null;

  const fetchOngoingCampaigns = async (page = 1) => {
    if (!user.memberIdx) return;
    const data = await getOngoingCampaigns(user.memberIdx, token, page);
    setOngoingCampaigns((prev) => [...prev, ...data.campaignList]);
    setOngoingPage(page);
    setOngoingHasMore(page < data.paginationInfo.totalPage);
  };

  const fetchCompletedCampaigns = async (page = 1) => {
    if (!user.memberIdx) return;
    const data = await getCompletedCampaigns(user.memberIdx, token, page);
    setCompletedCampaigns((prev) => [...prev, ...data.campaignList]);
    setCompletedPage(page);
    setCompletedHasMore(page < data.paginationInfo.totalPage);
  };

  useEffect(() => {
    if (userRole === "ROLE_USER") {
      fetchOngoingCampaigns(1);
      fetchCompletedCampaigns(1);
    }
  }, [userRole, token]);

  if (!userRole) return <div>Loading...</div>;

  // 플랫폼 리스트 (채널용)
  const platformList = [
    {
      code_id: "INF001",
      code_nm: "블로그",
      image_url: "https://cdn-icons-png.flaticon.com/512/2593/2593549.png",
    },
    {
      code_id: "INF002",
      code_nm: "인스타",
      image_url: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    },
    {
      code_id: "INF003",
      code_nm: "유튜브",
      image_url: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    },
    {
      code_id: "INF004",
      code_nm: "기타",
      image_url: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
    },
  ];

  return (
    <>
      {/* 프로필 영역 */}
      <div className="flex w-full gap-6">
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-4xl text-gray-400">
            {profileImg ? (
              <img
                src={profileImg}
                alt={nameToDisplay}
                className="w-full h-full object-cover"
              />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
        </div>
        <div className="w-1/2 space-y-4">
          <div className="flex items-baseline space-x-3">
            <div className="text-sm text-blue-400 bg-blue-100 font-bold rounded-md p-2">
              {userRole === "ROLE_OWNER" ? "소상공인" : "체험단"}
            </div>
            <h2 className="text-2xl font-bold">{nameToDisplay}</h2>
          </div>
          <ProfileStats user={user} userRole={userRole} />
          {/* 리뷰어 채널 영역 */}
          {userRole === "ROLE_USER" && (
          <ProfileChannels user={user} platformList={platformList} />
      )}
        </div>
      </div>

      {/* 캠페인 탭 영역 (리뷰어만) */}
      {userRole === "ROLE_USER" && (
        <div className="mt-10 font-['Noto_Sans_KR',sans-serif]">
          <div className="flex justify-center w-full mb-4">
            <div className="flex space-x-8 text-sm pb-2 border-b border-gray-300">
              {["진행중", "완료"].map((tab) => (
                <div
                  key={tab}
                  className={`relative cursor-pointer px-2 py-1 font-medium ${
                    activeTab === tab
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab} 체험단
                  {activeTab === tab && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-blue-500 w-[calc(100%-16px)]"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 캠페인 리스트 */}
          <div className="grid grid-cols-4 gap-4">
            {(activeTab === "진행중" ? ongoingCampaigns : completedCampaigns)
              .length > 0 ? (
              (activeTab === "진행중"
                ? ongoingCampaigns
                : completedCampaigns
              ).map((c) => (
                <div
                  key={c.campaignIdx}
                  className="border rounded-xl overflow-hidden shadow-sm"
                >
                  <img
                    src={toAbsoluteUrl(c.thumbnailUrl)}
                    alt={c.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-bold text-sm truncate">{c.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-4">
                {activeTab === "진행중"
                  ? "진행중 체험단 내역이 없습니다."
                  : "완료된 체험단 내역이 없습니다."}
              </p>
            )}
          </div>

          {/* 더보기 버튼 */}
          <div className="mt-4 text-center">
            {activeTab === "진행중" && ongoingHasMore && (
              <button
                onClick={() => fetchOngoingCampaigns(ongoingPage + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                더보기
              </button>
            )}
            {activeTab === "완료" && completedHasMore && (
              <button
                onClick={() => fetchCompletedCampaigns(completedPage + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                더보기
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

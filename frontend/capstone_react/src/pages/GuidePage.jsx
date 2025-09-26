import { useState } from "react";

import influencerImg from "../images/guide/userGuide.png";
import advertiserImg from "../images/guide/adGuide.png";
import gradeGuideImg from "../images/guide/gradePrepare.png";
import premiumGuideImg from "../images/guide/premiumPrepare.png";

import userIcon from "../images/guide/user.png";
import adIcon from "../images/guide/ad.png";
import gradeIcon from "../images/guide/grade.png";
import premiumIcon from "../images/guide/premium.png";

import arrowDown from "../images/guide/arrow.png";

export default function GuideTabs() {
  const [activeTab, setActiveTab] = useState("influencer");

 
 const tabs = [
  { id: "influencer", label: "인플루언서\n가이드", icon: userIcon, contentImg: influencerImg },
  { id: "advertiser", label: "광고주\n가이드",     icon: adIcon,   contentImg: advertiserImg },
  { id: "grade",      label: "체험단\n등급",        icon: gradeIcon, contentImg: gradeGuideImg },
  { id: "premium",    label: "프리미엄\n체험단",    icon: premiumIcon, contentImg: premiumGuideImg },
];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* 상단 제목 & 부제목 */}
      <header className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">이용 가이드</h2> 
        <p className="text-2xl md:text-3xl font-extrabold mt-4 
                      bg-gradient-to-r from-blue-400 to-blue-400
                      bg-clip-text text-transparent">
          Revory
        </p>
      </header>

      {/* 탭 버튼 그룹 */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
            className={`w-40 h-48 flex flex-col items-center justify-center
              space-y-6 border rounded-md shadow-sm p-4 transition
            ${activeTab === tab.id ? "border-blue-500 bg-blue-50 font-bold" : "border-gray-200 hover:bg-gray-50"}`}>
        <span className="text-lg font-semibold text-center whitespace-pre-line leading-tight">
            {tab.label}
        </span>
            <img src={tab.icon} alt={`${tab.label} 아이콘`} className="w-16 h-16 object-contain"/>
          </button>
         ))}
      </div>

      {/* 버튼 아래 꺾쇠 이미지 */}
      <div className="flex justify-center mb-20 mt-20">
        <img
          src={arrowDown}
          alt="아래 화살표"
          className="w-8 h-8 object-contain opacity-70"
        />
      </div>

      {/* 선택된 탭의 본문 이미지 */}
      <div className="flex justify-center">
        {tabs.map(tab =>
          activeTab === tab.id && (
            <img
              key={tab.id}
              src={tab.contentImg}
              alt={`${tab.label} 상세 이미지`}
              className="w-full max-w-3xl rounded shadow-md"
            />
          )
        )}
      </div>
    </section>
  );
}

import React, { useState } from "react";

const campaignTypes = [
  { id: "visit", label: "방문형", emoji: "🏠", description: "매장을 방문하고 체험 후 리뷰 작성" },
  { id: "takeout", label: "포장형", emoji: "🥡", description: "방문 후 포장하여 리뷰 작성" },
  { id: "delivery", label: "배송형", emoji: "📦", description: "배송받은 제품 사용 후 리뷰 작성" },
  { id: "purchase", label: "구매형", emoji: "🛒", description: "제품 구매 후 리뷰 작성" },
];

const categories = [
  { id: "food", label: "음식" },
  { id: "beauty", label: "뷰티" },
  { id: "fashion", label: "패션" },
  { id: "electronics", label: "전자제품" },
];


const channels = [
  { id: "blog", label: "블로그", description: "블로그 게시물 1건 업로드" },
  { id: "instagram", label: "인스타그램", description: "사진 3장 이상의 피드 게시물 1개 업로드" },
  { id: "blogclip", label: "블로그+클립", description: "블로그 게시물 1건 + 15초 영상 1개" },
  { id: "clip", label: "클립", description: "30초 영상 1개 업로드" },
  { id: "reels", label: "릴스", description: "30초 이상의 영상 1개 업로드" },
  { id: "youtube", label: "유튜브", description: "3분 이상의 영상 1개 업로드" },
  { id: "shorts", label: "쇼츠", description: "30초 이상의 유튜브 쇼츠 1개 업로드" },
  { id: "tiktok", label: "틱톡", description: "30초 이상의 영상 1개 업로드" },
];

export default function Step2({ formData, setFormData }) {
  const [selectedType, setSelectedType] = useState(formData.campaignType || "");
  const [selectedChannel, setSelectedChannel] = useState(formData.channelCode || "");
  const [selectedCategory, setSelectedCategory] = useState(formData.campaignCategory || "");

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setFormData({ ...formData, campaignType: typeId });
  };

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    setFormData({ ...formData, channelCode: channelId });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData({ ...formData, campaignCategory: categoryId });
  };

  return (
    <div className="space-y-6">
      {/* 홍보 유형 선택 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">홍보 유형 선택</h2>
        <div className="grid grid-cols-2 gap-4">
          {campaignTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`flex items-start p-4 border rounded-lg hover:border-blue-400 transition
                ${selectedType === type.id ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              <span className="text-3xl mr-4">{type.emoji}</span>
              <div className="text-left">
                <span className="font-medium">{type.label}</span>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 방문형/포장형 → 주소 입력 */}
      {(selectedType === "visit" || selectedType === "takeout") && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">체험 주소</label>
          <input
            type="text"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="주소를 입력하세요"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <input
            type="text"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="상세주소를 입력하세요"
            value={formData.addressDetail}
            onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
          />
        </div>
      )}

      {/* 배송형/구매형 → 구매 URL 입력 */}
      {(selectedType === "delivery" || selectedType === "purchase") && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">구매 URL</label>
          <input
            type="text"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="구매 링크를 입력하세요"
            value={formData.purchaseUrl}
            onChange={(e) => setFormData({ ...formData, purchaseUrl: e.target.value })}
          />
        </div>
      )}

        {/* 카테고리 선택 */}
        <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">카테고리 선택</h2>
        <select
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            value={formData.campaignCategory || ""}
            onChange={(e) =>
            setFormData({ ...formData, campaignCategory: e.target.value })
            }
        >
            <option value="">카테고리를 선택하세요</option>
            <option value="food">음식</option>
            <option value="beauty">뷰티</option>
            <option value="fashion">패션</option>
            <option value="electronics">전자제품</option>
        </select>
        </div>


      {/* 채널 선택 (라디오 버튼 왼쪽) */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">채널 선택</h2>
        <div className="grid grid-cols-2 gap-4">
          {channels.map((channel) => (
            <label
            key={channel.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-400 transition
                ${selectedChannel === channel.id ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
            <input
                type="radio"
                name="channel"
                value={channel.id}
                checked={selectedChannel === channel.id}
                onChange={() => handleChannelSelect(channel.id)}
                className="mr-3"
            />
            <div className="text-left">
                <span className="font-medium">{channel.label}</span>
                <p className="text-xs text-gray-500 mt-1">{channel.description}</p>
            </div>
            </label>

          ))}
        </div>
      </div>
    </div>
  );
}

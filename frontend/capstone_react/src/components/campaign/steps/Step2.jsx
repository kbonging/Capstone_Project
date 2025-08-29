import React, { useState, useEffect } from "react";

const campaignTypes = [
  { id: "CAMP001", label: "방문형", emoji: "🏠", description: "매장을 방문하고 체험 후 리뷰 작성" },
  { id: "CAMP002", label: "포장형", emoji: "🥡", description: "방문 후 포장하여 리뷰 작성" },
  { id: "CAMP003", label: "배송형", emoji: "📦", description: "배송받은 제품 사용 후 리뷰 작성" },
  { id: "CAMP004", label: "구매형", emoji: "🛒", description: "제품 구매 후 리뷰 작성" },
];

const categories = [
  { id: "CAMT001", label: "맛집" },
  { id: "CAMT002", label: "식품" },
  { id: "CAMT003", label: "뷰티" },
  { id: "CAMT004", label: "여행" },
  { id: "CAMT005", label: "디지털" },
  { id: "CAMT006", label: "반려동물" },
  { id: "CAMT007", label: "기타" },
];

const channels = [
  { id: "CAMC001", label: "블로그", description: "블로그 게시물 1건 업로드" },
  { id: "CAMC002", label: "인스타그램", description: "사진 3장 이상의 피드 게시물 1개 업로드" },
  { id: "CAMC003", label: "블로그+클립", description: "블로그 게시물 1건 + 15초 영상 1개" },
  { id: "CAMC004", label: "클립", description: "30초 영상 1개 업로드" },
  { id: "CAMC005", label: "릴스", description: "30초 이상의 영상 1개 업로드" },
  { id: "CAMC006", label: "유튜브", description: "3분 이상의 영상 1개 업로드" },
  { id: "CAMC007", label: "쇼츠", description: "30초 이상의 유튜브 쇼츠 1개 업로드" },
  { id: "CAMC008", label: "틱톡", description: "30초 이상의 영상 1개 업로드" },
];

export default function Step2({ formData, setFormData }) {
  const [selectedType, setSelectedType] = useState(formData.campaignType || "");
  const [selectedCategory, setSelectedCategory] = useState(formData.campaignCategory || "");
  const [selectedChannel, setSelectedChannel] = useState(formData.channelCode || "");

  const handleTypeSelect = (id) => {
    setSelectedType(id);
    setFormData({ ...formData, campaignType: id });
  };
  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setFormData({ ...formData, campaignCategory: id });
  };
  const handleChannelSelect = (id) => {
    setSelectedChannel(id);
    setFormData({ ...formData, channelCode: id });
  };

  // Step2 유효성 체크
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    if (!selectedType || !selectedCategory || !selectedChannel) {
      setIsValid(false);
      return;
    }
    if ((selectedType === "CAMP001" || selectedType === "CAMP002") && (!formData.address || !formData.addressDetail)) {
      setIsValid(false);
      return;
    }
    if ((selectedType === "CAMP003" || selectedType === "CAMP004") && !formData.purchaseUrl) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
  }, [selectedType, selectedCategory, selectedChannel, formData.address, formData.addressDetail, formData.purchaseUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">홍보 유형 선택 *</h2>
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

      {(selectedType === "CAMP001" || selectedType === "CAMP002") && (
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">체험 주소 *</label>
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

      {(selectedType === "CAMP003" || selectedType === "CAMP004") && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">구매 URL *</label>
          <input
            type="text"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="구매 링크를 입력하세요"
            value={formData.purchaseUrl}
            onChange={(e) => setFormData({ ...formData, purchaseUrl: e.target.value })}
          />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">카테고리 선택 *</h2>
        <select
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={selectedCategory}
          onChange={(e) => handleCategorySelect(e.target.value)}
        >
          <option value="">카테고리를 선택하세요</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">채널 선택 *</h2>
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

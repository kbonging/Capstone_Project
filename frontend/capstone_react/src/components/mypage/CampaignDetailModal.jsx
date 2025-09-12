import React from 'react';
import { toAbsoluteUrl } from "../../utils/url";

export default function CampaignDetailModal({ isOpen, onClose, post, onChangeStatus }) {
  if (!isOpen || !post) return null;

  const modalBackdropClasses = `
    fixed inset-0 bg-gray-600 bg-opacity-50
    flex justify-center items-center p-2 z-50
  `;

  const modalContentClasses = `
    bg-white rounded-2xl shadow-2xl overflow-hidden
    w-full max-w-[1600px] h-[80vh] max-h-[800px]
    transform transition-all duration-300
    flex flex-col
  `;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 'PENDING': return '대기';
      case 'APPROVED': return '승인';
      case 'REJECTED': return '반려';
      default: return '알 수 없음';
    }
  };

  return (
    <div className={modalBackdropClasses} onClick={onClose}>
      <div className={modalContentClasses} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">캠페인 상세</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            ✕
          </button>
        </div>

        {/* Main Grid */}
        <div className="flex flex-1 overflow-hidden p-4 gap-6">
          {/* 왼쪽 칸 (썸네일) */}
          <div className="flex-1 flex justify-center items-center overflow-hidden"> {/* items-center로 변경 */}
            {post.thumbnailUrl && (
              <div className="w-[400px] h-[300px] rounded-lg shadow-md overflow-hidden flex-shrink-0"> {/* 고정 크기 컨테이너 */}
                <img
                  src={toAbsoluteUrl(post.thumbnailUrl)}
                  alt="썸네일"
                  className="w-full h-full object-cover" // 부모 컨테이너를 꽉 채우도록 설정
                />
              </div>
            )}
          </div>

            {/* 가운데 칸 (정보들) */}
            <div className="flex-1 flex flex-col gap-3 text-sm sm:text-base text-gray-900 overflow-auto pr-2">
            <div><strong>제목:</strong> {post.title}</div>
            <div><strong>업체명:</strong> {post.shopName}</div>
            <div><strong>유형:</strong> {post.campaignTypeName}</div>
            <div><strong>카테고리:</strong> {post.categoryName}</div>
            <div><strong>제공 혜택:</strong> {post.benefitDetail}</div>
            <div><strong>키워드:</strong> {post.keyword1}, {post.keyword2}, {post.keyword3}</div>
            <div><strong>모집 인원:</strong> {post.recruitCount}명</div>

            {/* 유형별 정보 */}
            {(post.campaignTypeName === "배송형" || post.campaignTypeName === "구매형") && post.purchaseUrl && (
                <div>
                <strong>상품 URL:</strong>{" "}
                <a
                    href={post.purchaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-700"
                >
                    {post.purchaseUrl}
                </a>
                </div>
            )}

            {(post.campaignTypeName === "방문형" || post.campaignTypeName === "포장형") && (
                <div>
                <strong>주소:</strong> {post.address} {post.addressDetail ? ` ${post.addressDetail}` : ""}
                </div>
            )}

            <div><strong>신청 기간:</strong> {formatDate(post.applyStartDate)} ~ {formatDate(post.applyEndDate)}</div>
            <div><strong>체험 기간:</strong> {formatDate(post.expStartDate)} ~ {formatDate(post.expEndDate)}</div>
            <div><strong>발표 날짜:</strong> {formatDate(post.announceDate)}</div>
            <div><strong>리뷰 마감일:</strong> {formatDate(post.deadlineDate)}</div>

            <div>
                <strong>캠페인 상태:</strong>
                <span className={`ml-1 py-0.5 px-2 rounded-full text-xs font-semibold
                ${post.campaignStatus === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                    post.campaignStatus === 'APPROVED' ? 'bg-green-200 text-green-800' :
                    'bg-red-200 text-red-800'}`}>
                {getStatusText(post.campaignStatus)}
                </span>
            </div>
            <div><strong>모집 상태:</strong> {post.recruitStatus}</div>
            </div>

          {/* 오른쪽 칸 (미션) */}
          <div className="flex-1 flex flex-col gap-2 overflow-auto">
            <strong>미션:</strong>
            <p className="whitespace-pre-line">{post.mission}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition-colors"
            onClick={() => { onChangeStatus(post.campaignIdx, 'APPROVED'); onClose(); }}
          >
            승인
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-colors"
            onClick={() => { onChangeStatus(post.campaignIdx, 'REJECTED'); onClose(); }}
          >
            반려
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
    </div>
  </div>
  );
}
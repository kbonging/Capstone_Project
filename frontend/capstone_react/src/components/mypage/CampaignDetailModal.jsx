import React from 'react';

export default function CampaignDetailModal({ isOpen, onClose, post, onChangeStatus }) {
    if (!isOpen || !post) {
        return null;
    }

    const modalBackdropClasses = `
        fixed inset-0 bg-gray-600 bg-opacity-50
        flex justify-center items-center p-4
        z-50
    `;

    const modalContentClasses = `
        bg-white rounded-lg shadow-xl overflow-hidden
        w-full max-w-lg max-h-[90vh]
        transform transition-all duration-300
        scale-95 sm:scale-100
    `;

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '날짜 정보 없음';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // 상태 코드 변환 함수
    const getStatusText = (statusCode) => {
        switch (statusCode) {
            case 'REC001':
                return '대기';
            case 'REC002':
                return '승인';
            case 'REC003':
                return '반려';
            default:
                return '알 수 없음';
        }
    };

    return (
        <div className={modalBackdropClasses} onClick={onClose}>
            <div
                className={modalContentClasses}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">캠페인 상세 정보</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">제목</p>
                        <p className="text-gray-900 font-medium">{post.title}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">업체명</p>
                        <p className="text-gray-900">{post.shopName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">모집 상태</p>
                        <span className={`
                            py-1 px-3 rounded-full text-xs font-semibold
                            ${post.recruitStatus === 'REC001' ? 'bg-yellow-200 text-yellow-800' :
                              post.recruitStatus === 'REC002' ? 'bg-green-200 text-green-800' :
                              'bg-red-200 text-red-800'}
                        `}>
                            {getStatusText(post.recruitStatus)}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">캠페인 기간</p>
                        <p className="text-gray-900">{formatDate(post.startDate)} ~ {formatDate(post.endDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">제공 혜택</p>
                        <p className="text-gray-900">{post.benefit}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">리뷰 등록 기간</p>
                        <p className="text-gray-900">{formatDate(post.reviewStartDate)} ~ {formatDate(post.reviewEndDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">모집 인원</p>
                        <p className="text-gray-900">{post.recruitCount}명</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">주소</p>
                        <p className="text-gray-900">{post.address}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-green-600"
                        onClick={() => { onChangeStatus(post.campaignIdx, 'REC002'); onClose(); }}
                    >
                        승인
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-red-600"
                        onClick={() => { onChangeStatus(post.campaignIdx, 'REC003'); onClose(); }}
                    >
                        반려
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors hover:bg-gray-400"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

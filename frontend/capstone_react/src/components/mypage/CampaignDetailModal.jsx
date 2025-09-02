import React, { useState, useEffect } from 'react';

// 모달 컴포넌트 이름을 CampaignDetailModal로 변경했습니다.
export default function CampaignDetailModal({ isOpen, onClose, post, onChangeStatus }) {
    if (!isOpen || !post) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                    <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed mb-6">
                    <p className="mb-2"><strong>작성자:</strong> {post.author}</p>
                    <p className="mb-4"><strong>내용:</strong> {post.content}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-green-600"
                        onClick={() => { onChangeStatus(post.id, '승인'); onClose(); }}
                    >
                        승인
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-red-600"
                        onClick={() => { onChangeStatus(post.id, '반려'); onClose(); }}
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
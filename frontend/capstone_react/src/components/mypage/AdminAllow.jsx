import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import axios from "axios";

/**
 * 모든 캠페인 목록을 가져옵니다.
 * @param {string} token - 인증 토큰
 * @returns {Promise<Array<Object>>} 캠페인 목록
 */
async function getCampaignsList(token) {
    try {
        const response = await fetch(`/api/campaigns`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '캠페인 목록을 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API 호출 오류:", error);
        throw error;
    }
}

/**
 * 특정 캠페인의 상태를 변경합니다.
 * @param {number} campaignIdx - 캠페인 ID
 * @param {string} status - 변경할 상태 ('APPROVED' 또는 'REJECTED')
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} API 응답 데이터
 */
async function updateCampaignStatus(campaignIdx, status, token) {
    try {
        const response = await fetch(`/api/campaigns/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ campaignIdx, status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '상태 변경에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error("상태 업데이트 중 오류 발생:", error);
        throw error;
    }
}

const CampaignDetailModal = ({ isOpen, onClose, post, onChangeStatus }) => {
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
    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': '대기',
            'APPROVED': '승인',
            'REJECTED': '반려'
        };
        return statusMap[status] || '알 수 없음';
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
                        <p className="text-sm font-semibold text-gray-500 mb-1">상태</p>
                        <span className={`
                            py-1 px-3 rounded-full text-xs font-semibold
                            ${post.campaignStatus === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                            post.campaignStatus === 'APPROVED' ? 'bg-green-200 text-green-800' :
                            'bg-red-200 text-red-800'}
                        `}>
                            {getStatusText(post.campaignStatus)}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">모집 기간</p>
                        <p className="text-gray-900">{formatDate(post.applyStart)} ~ {formatDate(post.applyEnd)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">혜택</p>
                        <p className="text-gray-900">{post.benefitDetail}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">체험 기간</p>
                        <p className="text-gray-900">{formatDate(post.expStart)} ~ {formatDate(post.expEnd)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">모집 인원</p>
                        <p className="text-gray-900">{post.recruitCount}명</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">주소</p>
                        <p className="text-gray-900">{post.address} {post.addressDetail}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-green-600"
                        onClick={() => { onChangeStatus(post.campaignIdx, 'APPROVED'); onClose(); }}
                    >
                        승인
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-red-600"
                        onClick={() => { onChangeStatus(post.campaignIdx, 'REJECTED'); onClose(); }}
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
};

export default function App() {
    const [posts, setPosts] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('전체');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    // TODO: 실제 프로젝트에서는 적절한 인증 토큰을 설정해야 합니다.
    const [authToken, setAuthToken] = useState('your-auth-token-here');
    const { token } = useContext(AppContext);

    // 실제 API 호출로 데이터 로딩
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const data = await getCampaignsList(authToken);
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("API에서 예상치 못한 데이터 형식이 반환되었습니다.", data);
                    setPosts([]);
                }
            } catch (error) {
                console.error("캠페인 목록을 가져오는 데 실패했습니다.", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchCampaigns();
        } else {
            setLoading(false);
            console.error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        }
    }, [authToken]);

    // 글의 상태를 변경하는 함수
    const changeStatus = async (id, newStatus) => {
        try {
            // updateCampaignStatus API 함수를 사용하여 상태 변경을 서버에 반영
            await updateCampaignStatus(id, newStatus, authToken);
            console.log(`Document with ID ${id} successfully updated to ${newStatus}!`);

            // API 호출 성공 후, 클라이언트 상태 업데이트
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.campaignIdx === id ? { ...post, campaignStatus: newStatus } : post
                )
            );
        } catch (error) {
            console.error("상태 업데이트 실패:", error);
            // 에러 발생 시 사용자에게 알림을 제공하는 로직 추가 가능
        }
    };

    // 필터링된 글 목록 계산
    const filteredPosts = posts.filter(post => {
        const statusMap = { '전체': null, '대기': 'PENDING', '승인': 'APPROVED', '반려': 'REJECTED' };
        const statusToFilter = statusMap[currentFilter];
        return statusToFilter === null || post.campaignStatus === statusToFilter;
    });

    // 모달을 열고 상세 내용을 설정하는 함수
    const showModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    // 모달을 닫는 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="p-6 font-sans bg-gray-100 min-h-screen">
            <div className="w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">체험단 모집글 관리</h1>

                {/* 필터링 섹션 */}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-2 mb-6">
                    <button
                        onClick={() => setCurrentFilter('전체')}
                        className={`filter-btn px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentFilter === '전체' ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'}`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setCurrentFilter('대기')}
                        className={`filter-btn px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentFilter === '대기' ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'}`}
                    >
                        대기
                    </button>
                    <button
                        onClick={() => setCurrentFilter('승인')}
                        className={`filter-btn px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentFilter === '승인' ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'}`}
                    >
                        승인
                    </button>
                    <button
                        onClick={() => setCurrentFilter('반려')}
                        className={`filter-btn px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentFilter === '반려' ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'}`}
                    >
                        반려
                    </button>
                </div>

                {/* 글 목록 테이블 */}
                <div className="overflow-x-auto rounded-lg shadow-inner">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">제목</th>
                                <th className="py-3 px-6 text-left">업체명</th>
                                <th className="py-3 px-6 text-center">상태</th>
                                <th className="py-3 px-6 text-center">액션</th>
                            </tr>
                        </thead>
                        <tbody id="post-list" className="text-gray-600 text-sm font-light">
                            {filteredPosts.length === 0 ? (
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td colSpan="4" className="py-4 px-6 text-center text-gray-500">
                                        해당 상태의 글이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map(post => {
                                    const statusData = {
                                        'PENDING': { text: '대기', color: 'bg-yellow-200 text-yellow-800' },
                                        'APPROVED': { text: '승인', color: 'bg-green-200 text-green-800' },
                                        'REJECTED': { text: '반려', color: 'bg-red-200 text-red-800' },
                                    };
                                    const currentStatus = statusData[post.campaignStatus] || { text: '알 수 없음', color: 'bg-gray-200 text-gray-800' };

                                    return (
                                        <tr key={post.campaignIdx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    className="text-left text-blue-600 hover:underline font-medium"
                                                    onClick={() => showModal(post)}
                                                >
                                                    {post.title}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">{post.shopName}</td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[5rem]">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${currentStatus.color}`}>{currentStatus.text}</span>
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[8rem]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-md font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        onClick={() => changeStatus(post.campaignIdx, 'APPROVED')}
                                                    >
                                                        승인
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-md font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600"
                                                        onClick={() => changeStatus(post.campaignIdx, 'REJECTED')}
                                                    >
                                                        반려
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 모달 창 컴포넌트 */}
                <CampaignDetailModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    post={selectedPost}
                    onChangeStatus={changeStatus}
                />
            </div>
        </div>
    );
};

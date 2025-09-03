import React, { useState, useEffect, useContext } from 'react';
import { getCampaignsList, updateCampaignStatus } from '../../api/campaigns/api'
import { AppContext } from '../../contexts/AppContext';
import CampaignDetailModal from './CampaignDetailModal';

export default function AdminAllow() {
    const [posts, setPosts] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('전체');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AppContext);

    // 실제 API 호출로 데이터 로딩
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                const data = await getCampaignsList(token);
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

        if (token) {
            fetchCampaigns();
        } else {
            setLoading(false);
            console.error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        }
    }, [token]);

    // 글의 상태를 변경하는 함수
    const changeStatus = async (id, newStatus) => {
        try {
            await updateCampaignStatus(id, newStatus, token);
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 font-sans bg-gray-100">
            <div className="w-full p-8 bg-white shadow-lg rounded-xl">
                <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">체험단 모집글 관리</h1>

                {/* 필터링 섹션 */}
                <div className="flex flex-col justify-center gap-2 mb-6 sm:flex-row sm:justify-end">
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
                            <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-100">
                                <th className="px-6 py-3 text-left">제목</th>
                                <th className="px-6 py-3 text-left">업체명</th>
                                <th className="px-6 py-3 text-center">상태</th>
                                <th className="px-6 py-3 text-center">액션</th>
                            </tr>
                        </thead>
                        <tbody id="post-list" className="text-sm font-light text-gray-600">
                            {filteredPosts.length === 0 ? (
                                <tr className="transition-colors hover:bg-gray-50">
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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
                                        <tr key={post.campaignIdx} className="transition-colors border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    className="font-medium text-left text-blue-600 hover:underline"
                                                    onClick={() => showModal(post)}
                                                >
                                                    {post.title}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{post.shopName}</td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[5rem]">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${currentStatus.color}`}>{currentStatus.text}</span>
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[8rem]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="px-3 py-1 text-sm font-medium text-white transition-transform bg-green-500 rounded-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        onClick={() => changeStatus(post.campaignIdx, 'APPROVED')}
                                                    >
                                                        승인
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 text-sm font-medium text-white transition-transform bg-red-500 rounded-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600"
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

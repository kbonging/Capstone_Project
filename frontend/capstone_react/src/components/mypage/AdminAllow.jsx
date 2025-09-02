import React, { useState, useEffect } from 'react';
import CampaignDetailModal from "./CampaignDetailModal";

export default function AdminAllow() {
    const [posts, setPosts] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('전체');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [userId, setUserId]s] = useState(null); // 더 이상 필요하지 않음
    const MOCK_POSTS = [
        { id: 'post1', title: '강력한 무선 청소기 S-7 체험단 모집', author: '김현지', content: '최신형 무선 청소기의 강력한 흡입력을 경험해보세요!', status: '대기' },
        { id: 'post2', title: '프리미엄 커피 머신 C-33 리뷰어 찾아요', author: '박서준', content: '집에서 즐기는 완벽한 에스프레소, 지금 바로 신청하세요!', status: '승인' },
        { id: 'post3', title: '차세대 스마트 워치 W-99 사용 후기 이벤트', author: '이지은', content: '새로운 기능을 탑재한 스마트 워치를 가장 먼저 사용하고 후기를 남겨주세요!', status: '대기' },
        { id: 'post4', title: '겨울철 필수 아이템, 발열 내의 체험단', author: '최민준', content: '따뜻한 겨울을 위한 발열 내의를 무료로 경험할 기회!', status: '반려' },
        { id: 'post5', title: '신상 립스틱 5종 컬러 발색 체험단', author: '한아름', content: '자연스러운 발색과 촉촉함을 자랑하는 립스틱을 만나보세요.', status: '대기' },
    ];
    
    // 목업 데이터 로딩
    useEffect(() => {
        // 실제 API 호출을 시뮬레이션하기 위해 1초 지연
        const timer = setTimeout(() => {
            setPosts(MOCK_POSTS);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // 글의 상태를 목업 데이터에서 변경하는 함수
    const changeStatus = (id, newStatus) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id ? { ...post, status: newStatus } : post
            )
        );
        console.log(`Document with ID ${id} successfully updated to ${newStatus}!`);
    };

    // 필터링된 글 목록 계산
    const filteredPosts = posts.filter(post => {
        return currentFilter === '전체' || post.status === currentFilter;
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
                                <th className="py-3 px-6 text-left">작성자</th>
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
                                    const statusColor = post.status === '대기' ? 'bg-yellow-200 text-yellow-800' :
                                        post.status === '승인' ? 'bg-green-200 text-green-800' :
                                            'bg-red-200 text-red-800';

                                    return (
                                        <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <button
                                                    className="text-left text-blue-600 hover:underline font-medium"
                                                    onClick={() => showModal(post)}
                                                >
                                                    {post.title}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">{post.author}</td>
                                            {/* 상태 열의 너비를 조정하여 두 줄로 표시되는 현상을 방지합니다. */}
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[5rem]">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${statusColor}`}>{post.status}</span>
                                            </td>
                                            {/* 액션 열도 마찬가지로 너비를 확보합니다. */}
                                            <td className="py-4 px-6 text-center whitespace-nowrap min-w-[8rem]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-md font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        onClick={() => changeStatus(post.id, '승인')}
                                                    >
                                                        승인
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-md font-medium transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600"
                                                        onClick={() => changeStatus(post.id, '반려')}
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
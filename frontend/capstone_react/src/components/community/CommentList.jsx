// src/components/community/CommentList.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByCommunity } from "../../api/communityApi";
import { AppContext } from "../../contexts/AppContext";
//날짜 포맷팅이여서 프론트엔트에서 테스트 할떄 npm install dayjs 하셔야 실행 됩니다.
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function CommentList() {
  const { communityIdx } = useParams(); // URL에 /community/:communityIdx
  const { token } = useContext(AppContext);

  // 1) 두 타입(COMMT001, COMMT002)의 댓글을 합쳐서 보관할 상태
  const [flatComments, setFlatComments] = useState([]);

  // 2) 로딩/에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3) 최상위(depth=0) 댓글의 접힘/펼침 상태
  const [collapsedIds, setCollapsedIds] = useState({});

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    // 커뮤니티(COMMT001) 댓글과 캠페인(COMMT002) 댓글을 병렬로 요청
    const promiseComm = getCommentsByCommunity("COMMT001", communityIdx, token);
    const promiseCamp = getCommentsByCommunity("COMMT002", communityIdx, token);

    Promise.all([promiseComm, promiseCamp])
      .then(([resComm, resCamp]) => {
        // resComm.data, resCamp.data 각각 배열 형태라고 가정
        const merged = [
          ...(Array.isArray(resComm.data) ? resComm.data : []),
          ...(Array.isArray(resCamp.data) ? resCamp.data : []),
        ];

        // merged 배열을 상태에 저장
        setFlatComments(merged);

        // 최상위 댓글(depth=0)만 뽑아서 collapsedIds 초기화
        const initState = {};
        merged.forEach((c) => {
          if (c.depth === 0) {
            initState[c.commentIdx] = true;
          }
        });
        setCollapsedIds(initState);

        setLoading(false);
      })
      .catch((err) => {
        console.error("댓글 불러오기 실패:", err);
        setError(
          err.response?.data?.message || err.message || "알 수 없는 에러"
        );
        setLoading(false);
      });
  }, [communityIdx, token]);

  // 로딩 중 / 에러 시 처리
  if (loading) {
    return <p className="text-center py-8">댓글 로딩 중…</p>;
  }
  if (error) {
    return <p className="text-center py-8 text-red-500">에러: {error}</p>;
  }

  // 4) merged(flatComments)를 groupId, sortOrder 순으로 정렬
  const sortedComments = [...flatComments].sort((a, b) => {
    if (a.groupId !== b.groupId) return a.groupId - b.groupId;
    return a.sortOrder - b.sortOrder;
  });

  // 5) 이 comment 객체의 최상위 댓글 ID를 찾음음
  const findRootCommentIdx = (comment) => {
    if (comment.depth === 0) return comment.commentIdx;

    const mapById = {};
    flatComments.forEach((c) => {
      mapById[c.commentIdx] = c;
    });

    let curr = comment;
    while (curr.parentId) {
      curr = mapById[curr.parentId];
    }
    return curr.commentIdx;
  };

  // 6) 토글 핸들러: 최상위 댓글을 접거나 펼침
  const handleToggle = (rootCommentIdx) => {
    setCollapsedIds((prev) => ({
      ...prev,
      [rootCommentIdx]: !prev[rootCommentIdx],
    }));
  };

  return (
    <div className="border-t border-gray-200">
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => {
          const {
            commentIdx,
            depth,
            writerName,
            content,
            regDate,
            likeCount = 0,
          } = comment;

          const timeAgo = dayjs(regDate).fromNow();
          const rootId = findRootCommentIdx(comment);

          // depth > 0인 댓글인데, 해당 최상위(rootId)가 접힌 상태(false)라면 렌더 제외
          if (depth > 0 && collapsedIds[rootId] === false) {
            return null;
          }

          // — depth에 따라 각각 다른 UI 반환 —

          // (1) 최상위 댓글 (depth === 0)
          if (depth === 0) {
            return (
              <div
                key={commentIdx}
                className="px-6 py-5 flex space-x-4 border-b border-gray-200"
              >
                {/* 아바타 (최상위:  w-9 h-9 bg-gray-200) */}
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">
                    {writerName.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  {/* 작성자 · 시간 */}
                  <div className="flex justify-between">
                    <span className="font-semibold">{writerName}</span>
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                  </div>

                  {/* 댓글 내용 */}
                  <p className="mt-2 text-gray-700">{content}</p>

                  {/* 버튼 그룹: 토글 + 댓글쓰기 + 좋아요 + 신고 */}
                  <div className="mt-3 text-sm flex items-center space-x-5">
                    {/* 토글 버튼 */}
                    <button
                      className="toggle-replies flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => handleToggle(commentIdx)}
                    >
                      <i
                        className={`fas fa-chevron-${
                          collapsedIds[commentIdx] ? "up" : "down"
                        } w-3 h-3`}
                      ></i>
                      <span className="ml-1">
                        {collapsedIds[commentIdx]
                          ? `댓글 모두 숨기기 (${
                              flatComments.filter(
                                (c) =>
                                  findRootCommentIdx(c) === commentIdx &&
                                  c.depth > 0
                              ).length
                            })`
                          : `댓글 모두 보기 (${
                              flatComments.filter(
                                (c) =>
                                  findRootCommentIdx(c) === commentIdx &&
                                  c.depth > 0
                              ).length
                            })`}
                      </span>
                    </button>

                    {/* 댓글쓰기 */}
                    <button className="hover:text-gray-800">댓글쓰기</button>

                    {/* 좋아요 */}
                    <button className="flex items-center space-x-1 hover:text-gray-800">
                      <i className="fa-regular fa-thumbs-up w-4 h-4"></i>
                      <span>{likeCount}</span>
                    </button>

                    {/* 신고 */}
                    <button className="hover:text-red-600">신고</button>
                  </div>
                </div>
              </div>
            );
          }

          // (2) 대댓글 (depth === 1)
          if (depth === 1) {
            return (
              <div
                key={commentIdx}
                className="replies mt-4 space-y-4 pl-[60px]"
              >
                <div className="flex space-x-3 border-b border-gray-200 border-dashed pb-2">
                  {/* 아바타 (대댓글: w-8 h-8 bg-gray-200) */}
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold">
                      {writerName.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* 작성자 · 시간 */}
                    <div className="flex justify-between">
                      <span className="font-semibold">{writerName}</span>
                      <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>

                    {/* 댓글 내용 */}
                    <p className="mt-1 text-gray-700">{content}</p>

                    {/* 버튼 그룹 (답글 달기 + 좋아요 + 신고) */}
                    <div className="mt-2 text-sm flex space-x-5">
                      <button className="hover:text-gray-800">답글 달기</button>
                      <button className="flex items-center space-x-1 hover:text-gray-800">
                        <i className="fa-regular fa-thumbs-up w-4 h-4"></i>
                        <span>{likeCount}</span>
                      </button>
                      <button className="hover:text-red-600">신고</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // (3) 대대댓글 이상 (depth >= 2)
          if (depth >= 2) {
            return (
              <div
                key={commentIdx}
                className="replies mt-4 space-y-4 pl-[100px]"
              >
                <div className="flex space-x-3 border-b border-gray-200 border-dashed pb-2">
                  {/* 아바타 (대대댓글: w-8 h-8 bg-gray-50) */}
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-400 font-semibold">
                      {writerName.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* 작성자 · 시간 */}
                    <div className="flex justify-between">
                      <span className="font-semibold">{writerName}</span>
                      <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>

                    {/* 댓글 내용 (mt-1) */}
                    <p className="mt-1 text-gray-700">{content}</p>

                    {/* 버튼 그룹 (댓글쓰기 + 좋아요 + 신고) */}
                    <div className="mt-2 text-sm flex space-x-5">
                      <button className="hover:text-gray-800">댓글쓰기</button>
                      <button className="flex items-center space-x-1 hover:text-gray-800">
                        <i className="fa-regular fa-thumbs-up w-4 h-4"></i>
                        <span>{likeCount}</span>
                      </button>
                      <button className="hover:text-red-600">신고</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ( )
          return null;
        })
      ) : (
        <p className="px-6 py-6 text-sm text-gray-600">댓글이 없습니다.</p>
      )}
    </div>
  );
}

// src/components/community/CommentList.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByCommunity } from "../../api/communityApi";
import { AppContext } from "../../contexts/AppContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function CommentList() {
  const { communityIdx } = useParams(); // URL에 /community/:communityIdx
  const { token } = useContext(AppContext);

  const [flatComments, setFlatComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState({});

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    // 커뮤니티 댓글만 요청
    getCommentsByCommunity("COMMT001", communityIdx, token)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFlatComments(data);

        const initState = {};
        data.forEach((c) => {
          if (c.depth === 0) {
            initState[c.commentIdx] = true;
          }
        });
        setCollapsedIds(initState);
        setLoading(false);
      })
      .catch((err) => {
        console.error("댓글 불러오기 실패:", err);
        setError(err.response?.data?.message || err.message || "알 수 없는 에러");
        setLoading(false);
      });
  }, [communityIdx, token]);

  if (loading) return <p className="text-center py-8">댓글 로딩 중…</p>;
  if (error) return <p className="text-center py-8 text-red-500">에러: {error}</p>;

  const sortedComments = [...flatComments].sort((a, b) => {
    if (a.groupId !== b.groupId) return a.groupId - b.groupId;
    return a.sortOrder - b.sortOrder;
  });

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

          if (depth > 0 && collapsedIds[rootId] === false) return null;

          if (depth === 0) {
            return (
              <div key={commentIdx} className="px-6 py-5 flex space-x-4 border-b border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">{writerName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{writerName}</span>
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{content}</p>
                  <div className="mt-3 text-sm flex items-center space-x-5">
                    <button
                      className="toggle-replies flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => handleToggle(commentIdx)}
                    >
                      <i className={`fas fa-chevron-${collapsedIds[commentIdx] ? "up" : "down"} w-3 h-3`}></i>
                      <span className="ml-1">
                        {collapsedIds[commentIdx]
                          ? `댓글 모두 숨기기 (${flatComments.filter(c => findRootCommentIdx(c) === commentIdx && c.depth > 0).length})`
                          : `댓글 모두 보기 (${flatComments.filter(c => findRootCommentIdx(c) === commentIdx && c.depth > 0).length})`}
                      </span>
                    </button>
                    <button className="hover:text-gray-800">댓글쓰기</button>
                    <button className="flex items-center space-x-1 hover:text-gray-800">
                      <i className="fa-regular fa-thumbs-up w-4 h-4"></i>
                      <span>{likeCount}</span>
                    </button>
                    <button className="hover:text-red-600">신고</button>
                  </div>
                </div>
              </div>
            );
          }

          const indent = depth >= 2 ? "pl-[100px]" : "pl-[60px]";
          return (
            <div key={commentIdx} className={`replies mt-4 space-y-4 ${indent}`}>
              <div className="flex space-x-4 border-b border-gray-200 border-dashed pb-2">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-400 font-semibold">{writerName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{writerName}</span>
                    <span className="text-xs text-gray-500 mr-[23px]">{timeAgo}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{content}</p>
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
        })
      ) : (
        <p className="px-6 py-6 text-sm text-gray-600">댓글이 없습니다.</p>
      )}
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCommentsByCommunity,
  deleteComment,
  updateComment,
} from "../../api/communityApi";
import { toAbsoluteUrl } from "../../utils/url";
import { AppContext } from "../../contexts/AppContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReplyForm from "./ReplyForm";
dayjs.extend(relativeTime);

export default function CommentList({ refreshKey, onCommentAdded }) {
  const { communityIdx } = useParams();
  const { token, user, isAdmin } = useContext(AppContext);
  const [flatComments, setFlatComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedIds, setCollapsedIds] = useState({});
  const [replyBoxVisibleFor, setReplyBoxVisibleFor] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    getCommentsByCommunity("COMMT001", communityIdx, token)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFlatComments(data);
        const initState = {};
        data.forEach((c) => {
          if (c.depth === 0) initState[c.commentIdx] = true;
        });
        setCollapsedIds(initState);
      })
      .catch((err) => {
        console.error("댓글 불러오기 실패:", err);
        setError(
          err.response?.data?.message || err.message || "알 수 없는 에러"
        );
      })
      .finally(() => setLoading(false));
  }, [communityIdx, token, refreshKey]);

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

  const handleDelete = async (commentIdx) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentIdx, token);
      onCommentAdded?.();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = async (commentIdx) => {
    if (!editContent.trim()) return;
    try {
      await updateComment(commentIdx, { content: editContent.trim() }, token);
      setEditTarget(null);
      setEditContent("");
      onCommentAdded?.();
    } catch (err) {
      console.error("댓글 수정 실패", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="text-center py-8">댓글 로딩 중…</p>;
  if (error)
    return <p className="text-center py-8 text-red-500">에러: {error}</p>;

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
            memberIdx,
            delYn,
          } = comment;
          // const timeAgo = dayjs(regDate).fromNow();
          const rootId = findRootCommentIdx(comment);

          if (depth > 0 && collapsedIds[rootId] === false) return null;

          const indent =
            depth === 0 ? "px-6" : depth > 2 ? "pl-[100px]" : "pl-[60px]";
          const childCount = flatComments.filter(
            (c) => findRootCommentIdx(c) === commentIdx && c.depth > 0
          ).length;
          const isCommentWriter =
            user?.memberIdx && user.memberIdx === memberIdx;

          return (
            <div
              key={commentIdx}
              className={`replies mt-4 space-y-4 ${indent}`}
            >
              <div className="flex space-x-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={toAbsoluteUrl(
                      comment.profileImgUrl?.startsWith("/uploads/")
                        ? comment.profileImgUrl
                        : "/uploads/profiles/defaultprofile.png"
                    )}
                    alt={writerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{writerName}</span>
                    <span className="text-xs text-gray-500 mr-[23px]">
                      {regDate.substring(0, 10)}
                    </span>
                  </div>
                  {delYn === "Y" ? (
                    <p className="mt-1 text-gray-400 italic">
                      삭제된 댓글입니다.
                    </p>
                  ) : editTarget === commentIdx ? (
                    <div className="mt-1">
                      <textarea
                        className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                        rows="2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex justify-end mt-1 space-x-2">
                        <button
                          className="text-gray-400 text-sm"
                          onClick={() => setEditTarget(null)}
                        >
                          취소
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          onClick={() => handleEdit(commentIdx)}
                        >
                          수정 완료
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-700">{content}</p>
                  )}
                  <div className="mt-2 text-sm flex space-x-5">
                    {depth === 0 && childCount > 0 && (
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
                            ? `댓글 모두 숨기기 (${childCount})`
                            : `댓글 모두 보기 (${childCount})`}
                        </span>
                      </button>
                    )}
                    {delYn !== "Y" && (
                      <>
                        {depth < 1 && ( //depth 가 2 이하일때만 답글달기버튼 활성화
                          <button
                            className="hover:text-gray-800"
                            onClick={() => setReplyBoxVisibleFor(commentIdx)}
                          >
                            답글 달기
                          </button>
                        )}
                        {/* <button className="flex items-center space-x-1 hover:text-gray-800">
                          <i className="fa-regular fa-thumbs-up w-4 h-4"></i>
                          <span>{likeCount}</span>
                        </button> */}
                        {(isCommentWriter || isAdmin) && (
                          <>
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setEditTarget(commentIdx);
                                setEditContent(content);
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="text-red-500 hover:underline"
                              onClick={() => handleDelete(commentIdx)}
                            >
                              삭제
                            </button>
                          </>
                        )}
                        <button className="hover:text-red-600">신고</button>
                      </>
                    )}
                  </div>

                  {/*  ReplyForm 컴포넌트 */}
                  {replyBoxVisibleFor === commentIdx &&
                    delYn !== "Y" &&
                    depth < 2 && (
                      <ReplyForm
                        communityIdx={communityIdx}
                        parentCommentIdx={commentIdx}
                        onReplyAdded={() => {
                          setReplyBoxVisibleFor(null);
                          onCommentAdded?.();
                        }}
                      />
                    )}
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

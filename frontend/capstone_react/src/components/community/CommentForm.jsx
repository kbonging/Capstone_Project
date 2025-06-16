import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { postComment } from "../../api/communityApi";

export default function CommentForm({ postReviewerIdx, communityIdx, onCommentAdded }) {
  const { token, user } = useContext(AppContext);
  const currentUserIdx = user?.memberIdx;
  const isLoggedIn = !!token;
  const isPostOwner = currentUserIdx === postReviewerIdx;

  const canWriteComment = isLoggedIn && !isPostOwner;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 댓글 등록 요청 (JSON으로 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const commentData = {
      communityIdx: communityIdx, // 글 번호
      parentId: null,             // 최상위 댓글이므로 null
      content: content.trim(),    // 댓글 내용
    };

    try {
      setLoading(true);
      await postComment(commentData, token); // JSON 요청
      setContent("");
      onCommentAdded?.(); // 등록 후 부모에 알림
    } catch (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-6 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글 작성</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          id="comment-content"
          rows="4"
          placeholder={
            !isLoggedIn
              ? "댓글을 입력하려면 로그인 필요합니다."
              : isPostOwner
              ? "본인 게시글에는 댓글 작성이 불가합니다."
              : "댓글을 입력하세요."
          }
          className={`w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 ${
            canWriteComment
              ? "focus:ring-blue-300 bg-white text-gray-800"
              : "bg-gray-100 text-gray-500"
          }`}
          disabled={!canWriteComment || loading}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!canWriteComment || loading}
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
        {!isLoggedIn && (
          <p className="mt-2 text-xs text-gray-400">
            댓글을 쓰려면{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              로그인
            </a>{" "}
            이 필요합니다.
          </p>
        )}
      </form>
    </div>
  );
}

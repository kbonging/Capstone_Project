import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { postComment } from "../../api/communityApi";

export default function ReplyForm({ communityIdx, parentCommentIdx, onReplyAdded }) {
  const { token } = useContext(AppContext);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await postComment(
        {
          communityIdx: parseInt(communityIdx),
          parentId: parentCommentIdx, // 대댓글인 경우 parentId 필요!
          content: content.trim(),
        },
        token
      );
      setContent("");
      onReplyAdded?.();
    } catch (err) {
      console.error("대댓글 등록 실패", err);
      alert("대댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReply} className="mt-2">
      <textarea
        rows="2"
        className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        placeholder="답글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end mt-1 space-x-2">
        <button
          type="button"
          onClick={() => setContent("")}
          className="text-gray-400 text-sm"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "등록 중..." : "답글 등록"}
        </button>
      </div>
    </form>
  );
}

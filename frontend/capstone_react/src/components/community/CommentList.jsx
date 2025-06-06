// components/community/CommentList.jsx
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByCommunity } from "../../api/communityApi";
import { AppContext } from "../../contexts/AppContext";

export default function CommentList() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const { token } = useContext(AppContext);

  useEffect(() => {
    if (!token) return;

    console.log("👉 요청 communityIdx:", id);
    getCommentsByCommunity(id, token)
      .then((res) => {
        console.log("✅ 댓글 응답 데이터:", res.data);
        setComments(res.data);
      })
      .catch((err) => {
        console.error("❌ 댓글 불러오기 실패:", err);
      });
  }, [id, token]);

  return (
    <div className="border-t border-gray-200 px-6 py-6 text-gray-800 space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentIdx} className="border-b pb-4">
            <p className="font-semibold">{comment.writerName}</p>
            <p className="text-sm text-gray-600">{comment.content}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-600">댓글이 없습니다.</p>
      )}
    </div>
  );
}

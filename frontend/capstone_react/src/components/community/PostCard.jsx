import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { addLike, deleteLike } from "../../api/communityApi";

export default function PostCard({post}) {
  const { token } = useContext(AppContext);

  const [liked, setLiked] = useState(post.likeByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const handleLikeClick = async () => {
    try {
      if (liked) {
        await deleteLike(post.communityIdx, token); // 취소 API 호출
        setLikeCount((prev) => prev - 1);
      } else {
        await addLike(post.communityIdx, token); // 등록 API 호출
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked); // 상태 반전
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden">
      {/* 게시글 헤더 */}
      <header className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">
              {post.writerName?.charAt(0) || "익"}
            </span>
          </div>
          <span className="font-medium text-gray-700">{post.writerName}</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>{new Date(post.regDate).toLocaleString()}</span>
          <span className="before:content-['·'] before:mx-2">
            {post.viewCount}
          </span>
          {post.modDate && (
            <span className="text-blue-600 hover:underline cursor-pointer">
              수정됨
            </span>
          )}
        </div>
      </header>

      {/* 게시글 본문 */}
      <div className="relative top-[-100px] px-6 py-[130px] space-y-4 text-gray-700">
        <p>{post.content}</p>
      </div>
      {/* 좋아요 / 댓글 / 공유 */}
      <footer className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* ❤️ 좋아요 */}
        <button
          onClick={handleLikeClick}
          className="flex items-center space-x-2 transition-colors"
        >
        <i
          className={`relative ${
            liked
              ? "fa-solid fa-heart text-red-500 text-base translate-y-[-1px]"
              : "fa-regular fa-heart text-gray-500 hover:text-red-500 text-base translate-y-[-1px]"
          }`}
        />
          <span className={`text-sm font-medium ${liked ? "text-red-500 translate-y-[-1px]" : "text-gray-500 translate-y-[-1px] group-hover:text-red-500" }`}>
            {likeCount}
          </span>
        </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
            <i className="fas fa-comment w-5 h-5"></i>
            <span className="text-sm font-medium">
              댓글 {post.commentCount || 0}
            </span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
            <i className="fas fa-share w-5 h-5"></i>
            <span className="text-sm font-medium">공유</span>
          </button>
        </div>
        <div className="text-sm text-gray-400">조회 {post.viewCount}</div>
      </footer>
    </article>
  );
}

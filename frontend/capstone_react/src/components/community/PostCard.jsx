import { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { addLike, deleteLike } from "../../api/communityApi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const categoryColorMap = {
  COMMU001: "#FDD835",
  COMMU002: "#4DB6AC",
  COMMU003: "#7986CB",
  COMMU004: "#dc2626",
  COMMU005: '#2196F3',
};

export default function PostCard({ post, onDelete}) {
  const { token } = useContext(AppContext);
  const { user } = useContext(AppContext);
  const categoryColor = categoryColorMap[post.categoryId];

  console.log(user);

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
          <h1
            className="text-2xl mb-2 font-semibold"
            style={{ color: categoryColor }}
          >
            {post.categoryName}
          </h1>
          <h1 className="text-2xl  text-gray-900 mb-2">{post.title}</h1>
        </div>
        <div className="flex items-center space-x-3 mb-3 ">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">
              {post.writerName?.charAt(0) || "익"}
            </span>
          </div>
          <span className="font-medium text-gray-700">{post.writerName}</span>
          {post.auth === "ROLE_OWNER" && (
            <span className="ml-2 text-[11px] font-semibold text-white bg-cyan-400 px-[2px] rounded">
              소
            </span>
          )}
          {post.auth === "ROLE_USER" && (
            <span className="ml-2 text-[11px] font-semibold text-white bg-lime-500 px-[2px] rounded">
              리
            </span>
          )}
          {post.auth === "ROLE_ADMIN" && (
            <span className="ml-2 text-[11px] font-semibold text-white bg-red-600 px-[2px] rounded">
              관
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span className="w-1/6">{dayjs(post.regDate).format("YYYY.MM.DD HH:mm")}</span>
          <span className="w-1/6 text-sm text-gray-400">조회 {post.viewCount}</span>
          {/* {post.modDate && (
            <span className="text-blue-600 hover:underline cursor-pointer">
              수정됨
            </span>
            )} */}

          {(post.memberIdx === user.memberIdx || user.authDTOList?.some(auth => auth.auth === 'ROLE_ADMIN')) && (
            <div className="flex space-x-2 justify-end w-5/6">
              <Link to={`/community/edit/${post.communityIdx}`}>
                <button className="bg-gray-200 text-gray-600 px-3 py-2 rounded-sm font-semibold">
                  수정
                </button>
              </Link>
                <button onClick={() => onDelete(post.communityIdx)} 
                   className="bg-gray-200 text-gray-600 px-3 py-2 rounded-sm font-semibold">
                     삭제
                </button>
            </div>
          )}
        </div>
      </header>

      {/* 게시글 본문 */}
      <div
        className=" px-6 py-[130px] space-y-4 text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
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
                  ? "fa-solid fa-heart text-red-500 text-base "
                  : "fa-regular fa-heart text-gray-500 hover:text-red-500 text-base"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                liked
                  ? "text-red-500 "
                  : "text-gray-500  group-hover:text-red-500"
              }`}
            >
              좋아요 {likeCount}
            </span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500">
            <i className="far fa-comment-dots w-5 h-5 translate-y-[1px]"></i>
            <span className="text-sm font-medium ">
              댓글 {post.commentCount || 0}
            </span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
            <i className="fas fa-share w-5 h-5 translate-y-[1px]"></i>
            <span className="text-sm font-medium translate-y-[1px]">공유</span>
          </button>
        </div>
      </footer>
    </article>
  );
}

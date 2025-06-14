// pages/CommunityDetailPage.jsx
import PostHeader from "../components/community/PostHeader";
import PostCard from "../components/community/PostCard";
import CommentForm from "../components/community/CommentForm";
import CommentList from "../components/community/CommentList";
import { Link } from "react-router-dom";

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getCommunityDetail } from "../api/communityApi";
import { AppContext } from "../contexts/AppContext";

export default function CommunityDetailPage() {
  const { communityIdx } = useParams();
  const { token } = useContext(AppContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!communityIdx) return;

    setLoading(true);
    getCommunityDetail(communityIdx, token)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error("게시글 상세 조회 실패:", err);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [communityIdx, token]);

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 space-y-6 min-h-[80vh]">
      {loading ? (
        <>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
          </div>
        </>
      ) : post ? (
        <>
          <PostHeader post={post} />
          <PostCard post={post} />
          <div className="bg-white rounded-lg">
            <CommentForm />
            <CommentList id={communityIdx}/>
          </div>
          {/* <Link to="/community/write">
            <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold">
              글 수정
            </button>
          </Link> */}
        </>
      ) : (
        <p className="text-center py-8">게시글을 찾을 수 없습니다.</p>
      )}
    </div>
  );
}

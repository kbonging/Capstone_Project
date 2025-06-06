// pages/CommunityDetailPage.jsx
import PostHeader from '../components/community/PostHeader';
import PostCard from '../components/community/PostCard';
import CommentForm from '../components/community/CommentForm';
import CommentList from '../components/community/CommentList';

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
      .then(res => {
        setPost(res.data);
      })
      .catch(err => {
        console.error("게시글 상세 조회 실패:", err);
      })
      .finally(() => setLoading(false));
  }, [communityIdx, token]);

  if (loading) return <p className="text-center py-8">게시글 불러오는 중...</p>;
  if (!post) return <p className="text-center py-8">게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="max-w-3xl mx-auto my-8 p-4 space-y-6">
      <PostHeader title={post.title} categoryName={post.categoryName} />
      <PostCard post={post}/>
      <div className="bg-white rounded-lg">
        <CommentForm />
        <CommentList />
      </div>
    </div>
  );
}

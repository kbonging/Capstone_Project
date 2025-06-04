// pages/CommunityDetailPage.jsx
import PostHeader from '../components/community/PostHeader';
import PostCard from '../components/community/PostCard';
import CommentForm from '../components/community/CommentForm';
import CommentList from '../components/community/CommentList';

export default function CommunityDetailPage() {
  return (
    <div className="max-w-3xl mx-auto my-8 p-4 space-y-6">
      <PostHeader />
      <PostCard />
      <div className="bg-white rounded-lg">
        <CommentForm />
        <CommentList />
      </div>
    </div>
  );
}

// components/community/PostHeader.jsx
import { Link } from "react-router-dom";
export default function PostHeader() {

  return (
    <Link to='/community'>
      <nav className="text-2xl text-gray-800 font-semibold">
        <h1>커뮤니티</h1>
      </nav>
    </Link>
  );
}
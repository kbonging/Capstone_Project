// components/community/PostHeader.jsx
import { Link } from "react-router-dom";
export default function PostHeader() {

  return (
    <Link to='/community'>
      <nav className="text-2xl text-gray-800 font-semibold">
        <div className="relative two">
          <h1 className="relative text-[40px] font-light font-[Raleway] text-[#080808] transition-all duration-400 ease-in-out capitalize">
            커뮤니티
            {/* <span className="block text-[13px] font-medium uppercase tracking-[4px] leading-[3em] pl-1 text-black/40 pb-[10px]">
              사람들과 함께 나누는 이야기
            </span> */}
          </h1>
        </div>
      </nav>
    </Link>
  );
}
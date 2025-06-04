// components/community/PostCard.jsx
export default function PostCard() {
  return (
    <article className="bg-white rounded-lg overflow-hidden">
      {/* 게시글 헤더 */}
      <header className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">김</span>
          </div>
          <span className="font-medium text-gray-700">남국</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          개발자 신입은 뽑나요?
        </h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>약 2시간 전</span>
          <span className="before:content-['·'] before:mx-2">154</span>
          <span className="text-blue-600 hover:underline cursor-pointer">
            수정됨
          </span>
        </div>
      </header>

      {/* 게시글 본문 */}
      <div className="px-6 py-5 space-y-4 text-gray-700">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
          commodi asperiores, perspiciatis nemo odit non deleniti fugit repellat
          facere culpa nisi repellendus aut veniam, dolores expedita. Quasi, sit
          rem.
        </p>
      </div>

      {/* 좋아요 / 댓글 / 공유 */}
      <footer className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
            <i className="fa-regular fa-thumbs-up w-5 h-5"></i>
            <span className="text-sm font-medium">0</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
            <i className="fas fa-comment w-5 h-5"></i>
            <span className="text-sm font-medium">댓글 7</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
            <i className="fas fa-share w-5 h-5"></i>
            <span className="text-sm font-medium">공유</span>
          </button>
        </div>
        <div className="text-sm text-gray-400">조회 154</div>
      </footer>
    </article>
  );
}

// components/community/CommentForm.jsx
export default function CommentForm() {
  return (
    <div className="px-6 pt-6 pb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글 작성</h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="comment-content" className="sr-only">
            댓글 내용
          </label>
          <textarea
            id="comment-content"
            rows="4"
            placeholder="댓글을 입력하려면 로그인 필요합니다."
            className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-500"
            disabled
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
            disabled
          >
            등록
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          댓글을 쓰려면{" "}
          <a href="#" className="text-blue-600 hover:underline">
            로그인
          </a>{" "}
          이 필요합니다.
        </p>
      </form>
    </div>
  );
}

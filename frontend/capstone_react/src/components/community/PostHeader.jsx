// components/community/PostHeader.jsx
export default function PostHeader({title, categoryName}) {
  return (
    <nav className="text-sm text-gray-500">
      <a href="#" className="hover:underline">{categoryName}</a>
      <span className="mx-2">/</span>
      <a href="#" className="text-blue-600 hover:underline">{title}</a>
    </nav>
  );
}
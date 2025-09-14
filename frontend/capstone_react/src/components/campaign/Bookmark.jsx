import { useEffect, useState, useContext } from "react";
import BookmarkCard from "./BookmarkCard";
import Pagination from "../community/Pagination";
import { getBookmarkList } from "../../api/campaigns/api";
import { AppContext } from "../../contexts/AppContext";

export default function Bookmark() {
  const { user, token, loading } = useContext(AppContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user || !token) return;

    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarkList(token, page);
        setBookmarks(data.bookmarkList);
        setPagination(data.paginationInfo);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchBookmarks();
  }, [user, token, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <div>Loading...</div>; // AppContext 로딩 중 처리

  return (
    <div className="font-['Noto_Sans_KR',sans-serif]">
      <h1 className="text-lg font-medium mb-4">찜목록</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {bookmarks.map((campaign) => (
          <BookmarkCard key={campaign.campaignIdx} campaign={campaign} />
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
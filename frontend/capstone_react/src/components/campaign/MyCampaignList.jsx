import React, { useEffect, useMemo, useState } from "react";
import { getMyCampaigns, cancelMyApplication } from "../../api/campaigns/api";
import MyCampaignCard from "./MyCampaignCard";
import { hasUnread, isNewByTime, markSeen } from "../../utils/newBadge";
import { FiSearch } from "react-icons/fi";

const CHANNEL_OPTIONS = [
  { value: "", label: "채널" },
  { value: "BLOG", label: "블로그" },
  { value: "INSTA", label: "인스타" },
  { value: "YOUTUBE", label: "유튜브" },
];

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "APPLIED", label: "신청" },
  { value: "WIN", label: "선정" },
  { value: "CANCELLED", label: "취소" },
];

export default function MyCampaignList() {
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");

  //  내부 상태는 0-based로 유지
  const [page, setPage] = useState(0);

  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, number: 0 });
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  async function load() {
    setLoading(true);
    try {
      const data = await getMyCampaigns({
        token,
        channel,
        status,
        q,
        page: page + 1, // 서버는 1-based
      });

      const content = data?.content ?? data?.list ?? [];
      const currentZero = Math.max(0, (data?.number ?? 1) - 1);

      setItems(content);
      setPageInfo({
        totalPages: data?.totalPages ?? data?.paginationInfo?.totalPage ?? 1,
        number: currentZero,
      });
      if (currentZero !== page) setPage(currentZero);
    } catch (e) {
      console.error(e);
      setItems([]);
      setPageInfo({ totalPages: 1, number: 0 });
      alert(e?.message || "내 체험단 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, status, page]); // q는 검색 버튼으로만 트리거

  const onSearch = (e) => {
    e?.preventDefault?.();
    setPage(0);
    load();
  };

  const onCancel = async (applicationIdx) => {
    if (!confirm("정말 신청을 취소할까요?")) return;
    await cancelMyApplication({ token, applicationIdx });
    await load();
  };

  // 카드 클릭 시: 읽음 처리 후 즉시 UI 반영
  const onOpenCard = (applicationIdx) => {
    markSeen(applicationIdx);
    setItems((prev) => [...prev]); // 강제 리렌더
  };

  return (
    <div className="mx-auto">
      <h2 className="text-xl font-semibold mb-4">내 체험단</h2>

      {/* 필터 바 */}
      <form onSubmit={onSearch} className="flex items-center gap-3 mb-6">
        <select
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setPage(0);
          }}
          className="h-10 rounded-md border px-3"
        >
          {CHANNEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="h-10 rounded-md border px-3"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색"
            className="w-full h-10 rounded-md border pl-3 pr-10"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 h-8 w-8 grid place-items-center 
              border-zinc-300 bg-white text-zinc-600 
             hover:bg-zinc-50 hover:text-black transition-colors"
            aria-label="검색"
          >
            <FiSearch className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* 목록 */}
      {loading ? (
        <div className="py-16 text-center text-zinc-500">불러오는 중…</div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-zinc-500">내역이 없습니다.</div>
      ) : (
        // 반응형 1→2→3→4열
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((it) => {
            const isNew = hasUnread(it) || isNewByTime(it, 48);
            return (
              <MyCampaignCard
                key={it.applicationIdx}
                item={it}
                onCancel={onCancel}
                isNew={isNew}
                onOpen={onOpenCard}
              />
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {pageInfo.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="px-3 py-1 rounded border disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={pageInfo.number <= 0}
          >
            이전
          </button>
          <span className="px-2 py-1 text-sm text-zinc-600">
            {pageInfo.number + 1} / {pageInfo.totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-40"
            onClick={() =>
              setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))
            }
            disabled={pageInfo.number >= pageInfo.totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

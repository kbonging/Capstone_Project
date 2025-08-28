import React, { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { useNavigate, useParams, Link } from "react-router-dom";

/* ---------------------------
   0) MOCK 스위치
--------------------------- */
const USE_MOCK = true;

/* ---------------------------
   1) 실제 API 유틸
--------------------------- */
async function realGet(url) {
  const r = await fetch(url, { credentials: "include" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function realPost(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

/* ---------------------------
   2) MOCK 유틸 (백엔드 없이 테스트)
--------------------------- */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
async function mockGetApplyPage(id) {
  await delay(300);
  return {
    campaignIdx: Number(id),
    title: "[재택] LG전자 휘센 오브제컬렉션 제습기",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1604339455633-43f4013d24db?q=80&w=1600&auto=format&fit=crop",
    shopName: "리뷰노트 운영팀 사장님",
    categoryName: "디지털",
    channelName: "블로그",
    benefitDetail: "제품 무상 제공 (예상가 675,000원)",
    recruitCount: 1,
    applicants: 8648,
    productUrl: "https://bit.ly/4mwl0eB",
  };
}
async function mockCreateApplication(id, payload) {
  await delay(400);
  const key = "mockApplications";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push({
    applicationId: Date.now(),
    campaignId: Number(id),
    message: payload?.message ?? "",
    agreeTerms: !!payload?.agreeTerms,
    agreeMission: !!payload?.agreeMission,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(list));
  return { applicationId: list[list.length - 1].applicationId, status: "PENDING" };
}

/* ---------------------------
    현재상태는 목데이터 -> 환경에 따라 API 선택
--------------------------- */
const api = {
  getApplyPage: (id) =>
    USE_MOCK ? mockGetApplyPage(id) : realGet(`/api/campaigns/${id}/apply-page`),
  createApplication: (id, body) =>
    USE_MOCK ? mockCreateApplication(id, body) : realPost(`/api/campaigns/${id}/applications`, body),
};

/* ---------------------------
   4) 컴포넌트
--------------------------- */
export default function CampaignApply() {
  const { id } = useParams(); // /campaigns/:id/apply
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");

  // form
  const [oneLine, setOneLine] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMission, setAgreeMission] = useState(false);
  const canSubmit = agreeTerms && agreeMission;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getApplyPage(id);
        if (alive) setCampaign(data);
      } catch (e) {
        setError(e.message || "불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    try {
      setLoading(true);
      await api.createApplication(id, {
        message: oneLine?.trim() || "",
        agreeTerms: true,
        agreeMission: true,
      });
      // 성공 -> 상세로 이동(또는 완료 화면)
      nav(`/`);
    } catch (e) {
      setError(e.message || "신청 실패");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !campaign) return <div className="p-6">불러오는 중…</div>;
  if (error) return <div className="p-6 text-rose-600">에러: {error}</div>;
  if (!campaign) return null;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6 text-lg font-semibold">체험단 신청</div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* 좌측: 폼 */}
        <div>
          <div>
            <div className="mb-2 text-sm font-semibold">신청 한마디(선택)</div>
            <textarea
              value={oneLine}
              onChange={(e) => setOneLine(e.target.value)}
              className="h-36 w-full rounded-xl border border-stone-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="신청 시 참고가 될 내용을 작성해주세요."
            />
            <p className="mt-2 text-xs text-stone-500">
              운영자가 선정 시 참고합니다. 비방/광고성 문구는 제외될 수 있어요.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <label className="flex cursor-pointer select-none items-start gap-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              <span className="text-sm text-stone-700">
                체험단 유의사항, 개인정보 및 콘텐츠 3자 제공, 저작물 이용에 동의합니다.{" "}
                <Link
                  to={`/policies/experience-terms`}
                  target="_blank"
                  className="text-sky-600 underline"
                >
                  자세히 보기
                </Link>
              </span>
            </label>

            <label className="flex cursor-pointer select-none items-start gap-3">
              <input
                type="checkbox"
                checked={agreeMission}
                onChange={(e) => setAgreeMission(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              <span className="text-sm text-stone-700">
                체험단 미션을 모두 확인했습니다.{" "}
                <a
                  href={campaign?.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 underline"
                >
                  상세 미션 보기 <FiExternalLink className="inline" />
                </a>
              </span>
            </label>
          </div>

          <button
            onClick={onSubmit}
            disabled={!canSubmit || loading}
            className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold ${
              canSubmit
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "cursor-not-allowed bg-stone-200 text-stone-500"
            }`}
          >
            체험단 신청
          </button>

          {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}
        </div>

        {/* 우측: 요약 카드 */}
        <aside className="overflow-hidden rounded-2xl border border-stone-200 bg-white ">
          <div className="border-b p-4">
            <div className="text-sm text-stone-500">선택한 캠페인</div>
            <div className="mt-1 font-semibold">{campaign.title}</div>
          </div>
          <div className="flex items-start gap-4 p-4">
            <img
              src={campaign.thumbnailUrl}
              alt=""
              className="h-28 w-28 rounded-md border object-cover"
            />
            <div className="flex-1 text-sm">
              <div className="text-stone-700">{campaign.shopName}</div>
              <div className="mt-1 text-stone-500">
                {campaign.categoryName} · {campaign.channelName}
              </div>
              <div className="mt-2 text-stone-700">{campaign.benefitDetail}</div>
              <div className="mt-2 text-xs text-stone-500">
                신청 {campaign.applicants?.toLocaleString?.() ?? 0} / 모집{" "}
                {campaign.recruitCount ?? "-"}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

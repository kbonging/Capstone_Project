import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShare2,
  FiExternalLink,
  FiLock,
  FiTag,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiVideo,
  FiImage,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import CampaignCalendar from "./CampaignCalendar";

/* 작은 공용 컴포넌트 */
const Badge = ({ children, tone = "green" }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
      tone === "green"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : tone === "blue"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : "border-stone-200 bg-stone-50 text-stone-600"
    }`}
  >
    {children}
  </span>
);

const InfoRow = ({ label, children, icon }) => (
  <div className="grid grid-cols-[150px_1fr] gap-4 border-b border-stone-200 py-3">
    <div className="flex items-start gap-1 text-lg font-medium text-stone-700">
      {icon ? <span className="mt-0.5">{icon}</span> : null}
      <span>{label}</span>
    </div>
    <div className="text-base text-stone-800">{children}</div>
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-md border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700">
    {children}
  </span>
);

const f = (d) =>
  new Date(d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* 상세 페이지 */
export default function CampaignDetail({ campaign }) {
  const [openScheduleInfo, setOpenScheduleInfo] = useState(false); // 일정 텍스트 토글
  const navigate = useNavigate(); //라우트용
  // 데모 데이터 (API 연동 시 props로 대체)
  const data = campaign ?? {
    campaignIdx: 101,
    title: "[재택] LG전자 휘센 오브제컬렉션 제습기",
    shopName: "리뷰노트 운영팀 사장님",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1604339455633-43f4013d24db?q=80&w=1600&auto=format&fit=crop",
    campaignType: "CAMP003", // 배송형
    categoryName: "디지털",
    channelName: "블로그",
    recruitCount: 1,
    applicants: 8648,
    benefitDetail: "제품 무상 제공 (예상가 675,000원)",
    keyword1: "리뷰노트 이벤트",
    keyword2: "리뷰노트 체험단",
    keyword3: "제습기",
    productUrl: "https://bit.ly/4mwl0eB",
    mission: `
      <ul class="list-disc pl-4 space-y-2">
        <li>제품 수령 후 언박싱 사진 3장 이상 + 사용영상 1개 또는 GIF</li>
        <li>키워드 <b>‘제습기’</b>, <b>‘LG전자 휘센’</b> 포함</li>
        <li>리뷰어 도매체에 동일 후기 복붙 금지</li>
      </ul>
    `,
    dates: {
      applyStart: "2025-07-31",
      applyEnd: "2025-08-29",
      announce: "2025-08-29",
      expStart: "2025-08-30",
      expEnd: "2025-09-12",
      deadline: "2025-09-20",
    },
    recruitStatus: "REC001",
    campaignStatus: "CAMS002",
    visitInfo: null,
    deliveryInfo: { purchaseUrl: null },
  };

  const isRecruitOpen = data.recruitStatus === "REC001";

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="blue">{data.channelName}</Badge>
            <Badge>
              {data.campaignType === "CAMP003" ? "배송형(온라인)" : "방문형"}
            </Badge>
            <Badge tone="stone">{data.categoryName}</Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-900">
            {data.title}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-stone-500">
            <span>주최자</span>
            <span className="font-medium text-stone-800">{data.shopName}</span>
            <span className="inline-flex items-center gap-1">
              <FiLock /> OP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-start">
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">
            <FiShare2 className="mr-1 inline-block" /> 공유
          </button>
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-stone-50">
            <FiHeart className="mr-1 inline-block" /> 찜
          </button>
        </div>
      </div>

      {/* 본문 2컬럼 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* 좌측 카드 */}
        <div className="rounded-2xl  bg-white ">
          <div className="border-b  px-5 pt-4 pb-2">
            <div className="text-xl font-bold text-stone-900">제공상품/물품</div>
            <div className="mt-1  text-stone-900">{data.benefitDetail}</div>
          </div>

          <div className="px-5 ">
            <InfoRow label="배송 및 구매 안내" icon={<FiTruck />} >
              <ul className="text-xl list-disc space-y-1 pl-4">
                <li>선정되면 등록 프로필 배송지로 제품 발송</li>
                <li>
                  배송 시작 이후 제품하자 아닌 단순취소 시 왕복배송비 청구
                </li>
              </ul>
            </InfoRow>

            <InfoRow label="키워드 정보" icon={<FiTag />}>
              <div className="flex flex-wrap gap-2 text-xl">
                {[data.keyword1, data.keyword2, data.keyword3]
                  .filter(Boolean)
                  .map((k, i) => (
                    <Chip key={i}>{k}</Chip>
                  ))}
              </div>
            </InfoRow>

            <InfoRow label="상품정보 URL" icon={<FiExternalLink />}>
              <a
                href={data.productUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-sky-600 underline text-xl"
              >
                {data.productUrl}
              </a>
            </InfoRow>

            <InfoRow label="체험단 미션" icon={<FiImage />}>
              <div
                className="prose prose-sm max-w-none prose-li:marker:text-stone-400"
                dangerouslySetInnerHTML={{ __html: data.mission }} // sanitize 권장
              />
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1">
                  <FiImage /> 사진 15장↑
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiVideo /> 영상 or GIF 1
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiTag /> 키워드 필수
                </span>
              </div>
            </InfoRow>

            <InfoRow label="일정 요약" icon={<FiCalendar />}>
              추후 작업
            </InfoRow>
          </div>
        </div>

        {/* 우측 사이드 */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white ">
            <img
              src={data.thumbnailUrl}
              alt="thumbnail"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-3 p-4 ">
              {/* 일정 텍스트 토글 */}
              <div className="flex items-center justify-between border-b">
                <div className="text-sm font-semibold ">체험단 일정</div>
                <button
                  type="button"
                  onClick={() => setOpenScheduleInfo((v) => !v)}
                  className="rounded-md border px-2 py-1 text-xs text-stone-600 hover:bg-stone-50 mb-1"
                >
                  {openScheduleInfo ? (
                    <>
                      <FiChevronUp className="inline" />
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="inline" />
                    </>
                  )}
                </button>
              </div>

              {openScheduleInfo && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500">
                      체험단 신청기간
                    </span>
                    <span>
                      {f(data.dates.applyStart)} ~ {f(data.dates.applyEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500">
                      리뷰어 발표
                    </span>
                    <span>{f(data.dates.announce)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500">
                      체험기간
                    </span>
                    <span>
                      {f(data.dates.expStart)} ~ {f(data.dates.expEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-stone-500">
                      리뷰 마감
                    </span>
                    <span>{f(data.dates.deadline)}</span>
                  </div>
                  <div className="mt-2 border-t pt-2 text-xs text-stone-600">
                    실시간 지원 현황{" "}
                    <span className="font-semibold text-sky-600">
                      지원 {data.applicants?.toLocaleString?.() ?? 0}
                    </span>{" "}
                    / 모집 {data.recruitCount ?? "-"}
                  </div>
                </div>
              )}

              {/* 달력은 항상 표시 */}
              <CampaignCalendar
                initialMonth={new Date(data.dates.applyEnd)}
                ranges={[
                  // 모집 (회색)
                  {
                    start: new Date(2025, 6, 31),
                    end: new Date(2025, 7, 29),
                    label: "모집",
                    tone: "muted",
                  },

                  // 체험기간 (초록) — ✅ 연속 바로
                  {
                    start: new Date(2025, 8, 5),
                    end: new Date(2025, 8, 12),
                    label: "체험기간",
                    tone: "green",
                  },

                  // 발표 (분홍) — 단일일 bar
                  {
                    start: new Date(2025, 7, 30),
                    end: new Date(2025, 7, 30),
                    label: "발표",
                    tone: "amber",
                  },

                  // 리뷰마감 (보라) — 단일일 bar
                  {
                    start: new Date(2025, 8, 13),
                    end: new Date(2025, 8, 13),
                    label: "리뷰마감",
                    tone: "violet",
                  },
                ]}
                bottomLabel="체험&리뷰"
              />

              <button onClick={() => navigate(`/campaigns/${data.campaignIdx}/apply`)}
                className={`mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                  isRecruitOpen
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "cursor-not-allowed bg-stone-200 text-stone-500"
                }`}
                disabled={!isRecruitOpen}
              >
                신청하기
              </button>
            </div>
          </div>

          {/* 방문형 안내 (선택) */}
          {data.campaignType === "CAMP001" && data.visitInfo && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FiMapPin /> 방문 정보
              </div>
              <div className="text-sm text-stone-700">
                {data.visitInfo.address} {data.visitInfo.addressDetail}
                <div className="mt-1 text-xs text-stone-500">
                  영업 {data.visitInfo.day} / {data.visitInfo.startTime}~
                  {data.visitInfo.endTime}
                </div>
              </div>
              {data.visitInfo.notice ? (
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  {data.visitInfo.notice}
                </p>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

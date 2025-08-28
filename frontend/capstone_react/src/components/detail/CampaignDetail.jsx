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
  FiLink,
  FiAlertCircle, // ✅ 공정위 표기 아이콘(대체)
} from "react-icons/fi";
import { TbArticle } from "react-icons/tb"; // ✅ 1,000자 아이콘
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
      <ul class="list-none pl-4 space-y-2">
        <li>제품 수령 후 언박싱 사진 3장 이상 + 사용영상 1개 또는 GIF</li>
        <li>키워드 <b>‘제습기’</b>, <b>‘LG전자 휘센’</b> 포함</li>
        <li>1. 리뷰노트에서 새롭게 오픈한 시스템</li>
        <li>2. 고가의 제품을 로또처럼 신청자 중 랜덤 룰렛을 통해 추첨</li>
        <li>3. 제품 소개가 아닌 리뷰노또 당첨 후기 블로그+릴스 작성</li>
        <li>4. 리뷰노트 커뮤니티에 간단한 당첨 후기 작성</li>
        <li>(제목에 '리뷰노또' 키워드를 포함해 주세요.)</li>
        <li>5. 인스타그램 reviewnote_in 계정 팔로우 필수</li>
        (당첨 후 팔로우가 되어 있지 않을 경우 취소될 수 있습니다.)
        <li>6. 당첨되신 분께는 개별적으로 연락드립니다.</li>
        <li>7. 당첨 영상은 인스타그램 reviewnote_in 계정에서 확인</li>
        <li>(8월 29일 금요일 오후 5시 당첨자 발표 영상 업로드 예정)</li>
        <br>
        <br>
        <li>📍가이드라인 (블로그)</li>
          <ul>
            <li>사진 최소 15장 이상</li>
            <li>텍스트 1,000자 이상</li>
            <li>리뷰 발행 시 스크랩 (블로그/카페 공유, 외부 공유 허용) 허용</li>
          </ul>   
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
        {/* 좌측 카드 (리디자인) */}
        <div className="rounded-2xl  border-stone-200 bg-white">
          {/* 상단 제목/요약 */}
          <div className="px-5 pt-5 pb-3 border-b border-stone-200">
            <div className="text-sm text-stone-500">제공상품/물품</div>
            <div className="mt-1 text-[15px] md:text-base font-medium text-stone-900">
              {data.benefitDetail}
            </div>
          </div>

          {/* 항목 리스트 */}
          <div className="px-5 py-2">
            {/* 주최자 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-6">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800">
                <FiLock className="translate-y-[-1px]" />
                <span>주최자</span>
              </div>
              <div className="text-[15px] text-stone-900">{data.shopName}</div>
            </div>

            {/* 배송 및 구매 안내 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-6">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800">
                <FiTruck className="translate-y-[-1px]" />
                <span>배송 및 구매 안내</span>
              </div>
              <div className="text-[15px] text-stone-800">
                <ul className="list-none pl-5 space-y-1 leading-6">
                  <li>선정되면 등록된 프로필 배송지로 제품 발송</li>
                  <li>제품 하자 외 단순변심 취소 시 왕복배송비 청구</li>
                </ul>
              </div>
            </div>

            {/* 키워드 정보 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-6">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800">
                <FiTag className="translate-y-[-1px]" />
                <span>키워드 정보</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[data.keyword1, data.keyword2, data.keyword3]
                  .filter(Boolean)
                  .map((k, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700"
                    >
                      {k}
                    </span>
                  ))}
              </div>
            </div>

            {/* 상품정보 URL */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-10">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800">
                <FiExternalLink className="translate-y-[-1px]" />
                <span>상품정보 URL</span>
              </div>
              <div className="text-[15px]">
                <a
                  href={data.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-sky-600 underline underline-offset-2 hover:text-sky-700"
                >
                  {data.productUrl}
                </a>
              </div>
            </div>

            {/* 체험단 미션 (스샷 스타일: 탭 + 아이콘 그리드) */}
            <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-stone-200 py-8">
              <div className="flex items-start gap-2 text-[15px] font-semibold text-stone-800">
                <FiImage className="translate-y-[3px]" />
                <span className="">체험단 미션</span>
              </div>
              
              <div>
                {/* 상단 탭 느낌 */}
                <div className="mb-3 w-full rounded bg-stone-200 py-1 text-center text-sm font-medium text-stone-700">
                  블로그
                </div>

                {/* 아이콘 6개 그리드 */}
                <div className="grid grid-cols-6 gap-4 text-center text-xs font-medium text-stone-700">
                  <div className="flex flex-col items-center gap-1">
                    <FiTag size={22} />
                    <span>키워드</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FiImage size={22} />
                    <span>15장 이상</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <TbArticle size={22} />
                    <span>1,000자</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FiLink size={22} />
                    <span>링크 첨부</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FiVideo size={22} />
                    <span>동영상 or GIF</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FiAlertCircle size={22} />
                    <span>공정위 표기</span>
                  </div>
                </div>

                {/* 필요 시 상세 가이드(에디터 HTML) */}
                <div
                  className="mt-4 prose prose-sm max-w-none prose-li:marker:text-stone-400 "
                  dangerouslySetInnerHTML={{ __html: data.mission }}
                />
              </div>
            </div>

            {/* 일정 요약 */}
            <div className="grid grid-cols-[120px_1fr] gap-4 py-3">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-stone-800">
                <FiCalendar className="translate-y-[-1px]" />
                <span>일정 요약</span>
              </div>
              <div className="text-[15px] text-stone-800 space-y-1">
                <div>
                  신청기간: {f(data.dates.applyStart)} ~{" "}
                  {f(data.dates.applyEnd)}
                </div>
                <div>발표: {f(data.dates.announce)}</div>
                <div>
                  체험기간: {f(data.dates.expStart)} ~ {f(data.dates.expEnd)}
                </div>
                <div>리뷰 마감: {f(data.dates.deadline)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 사이드 */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <img
              src={data.thumbnailUrl}
              alt="thumbnail"
              className="h-64 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-3 p-4">
              {/* 일정 텍스트 토글 */}
              <div className="flex items-center justify-between border-b">
                <div className="text-sm font-semibold">체험단 일정</div>
                <button
                  type="button"
                  onClick={() => setOpenScheduleInfo((v) => !v)}
                  className="mb-1 rounded-md border px-2 py-1 text-xs text-stone-600 hover:bg-stone-50"
                >
                  {openScheduleInfo ? (
                    <FiChevronUp className="inline" />
                  ) : (
                    <FiChevronDown className="inline" />
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

              {/* 달력 */}
              <CampaignCalendar
                initialMonth={new Date(data.dates.applyEnd)}
                ranges={[
                  {
                    start: new Date(2025, 6, 31),
                    end: new Date(2025, 7, 29),
                    label: "모집",
                    tone: "muted",
                  },
                  {
                    start: new Date(2025, 8, 5),
                    end: new Date(2025, 8, 12),
                    label: "체험기간",
                    tone: "green",
                  },
                  {
                    start: new Date(2025, 7, 30),
                    end: new Date(2025, 7, 30),
                    label: "발표",
                    tone: "amber",
                  },
                  {
                    start: new Date(2025, 8, 13),
                    end: new Date(2025, 8, 13),
                    label: "리뷰마감",
                    tone: "violet",
                  },
                ]}
                bottomLabel="체험&리뷰"
              />

              <button
                onClick={() => navigate(`/campaigns/${data.campaignIdx}/apply`)}
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

          {/* 방문형 안내 */}
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

// src/pages/CampaignApply.jsx
import React, { useEffect, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getApplyPage, createApplication } from "../api/campaigns/api";
import  Badge  from "../components/common/Badge"; // ⚠️ 경로는 프로젝트 구조에 맞게 수정
import { toAbsoluteUrl } from "../utils/url";

/* ---------------------------
   Daum 우편번호 API
--------------------------- */
function loadDaumPostcode() {
  return new Promise((resolve, reject) => {
    if (window.daum?.Postcode) return resolve();
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Daum Postcode script load 실패"));
    document.head.appendChild(script);
  });
}

async function openPostcode(onSelect) {
  await loadDaumPostcode();
  new window.daum.Postcode({
    oncomplete: function (data) {
      const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
      onSelect({ zonecode: data.zonecode, address: addr });
    },
  }).open();
}

/* ---------------------------
   메인 컴포넌트
--------------------------- */
export default function CampaignApply() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // form state
  const [oneLine, setOneLine] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMission, setAgreeMission] = useState(false);

  // 주소 입력
  const [addr, setAddr] = useState({ zipCode: "", address: "", detailAddress: "" });

  // 제출 가능 여부
  const canSubmit =
    isLoggedIn &&
    agreeTerms &&
    agreeMission &&
    (campaign?.allowApply !== false) &&
    (campaign?.alreadyApplied !== true) &&
    isAddressOk();

  function isAddressOk() {
    if (!campaign?.requireAddress) return true;
    if (campaign?.hasAddress === true) return true;
    if (campaign?.hasAddress == null) return false;
    return Boolean(addr.zipCode?.trim() && addr.address?.trim());
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        const data = await getApplyPage(id, token);
        if (!alive) return;

        const safe = {
          ...data,
          hasAddress: Object.prototype.hasOwnProperty.call(data, "hasAddress")
            ? data.hasAddress
            : null,
        };
        setCampaign(safe);

        if (safe?.hasAddress === false) {
          setAddr({
            zipCode: safe?.zipCode || "",
            address: safe?.address || "",
            detailAddress: safe?.detailAddress || "",
          });
        }
      } catch (e) {
        setError(e.message || "불러오기 실패");
      } finally {
        if (alive) setLoading(false);
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
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      const payload = {
        applyReason: oneLine?.trim() || "",
        agreeTerms: true,
        agreeMission: true,
        ...(campaign?.requireAddress && campaign?.hasAddress === false
          ? {
              zipCode: addr.zipCode || "",
              address: addr.address || "",
              detailAddress: addr.detailAddress || "",
              saveAddressToProfile: true,
            }
          : {}),
      };

      await createApplication(id, payload, token);
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

  const showAddressSection =
    campaign.requireAddress && (campaign.hasAddress == null || campaign.hasAddress === false);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6 text-lg font-semibold">체험단 신청</div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        {/* 좌측: 신청 폼 */}
        <div>
          <div>
            <div className="mb-2 text-sm font-semibold">신청 한마디(선택)</div>
            <textarea
              value={oneLine}
              onChange={(e) => setOneLine(e.target.value)}
              className="h-28 w-full rounded-md border border-stone-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="신청 시 참고가 될 내용을 작성해주세요."
            />
            <p className="mt-2 text-xs text-stone-500">
              운영자가 선정 시 참고합니다. 비방/광고성 문구는 제외될 수 있어요.
            </p>
          </div>

          {/* 주소 섹션 */}
          {showAddressSection && (
            <section className="mt-8 space-y-2 rounded-xl  border-stone-200 bg-white p-4">
              <label className="block text-sm font-semibold text-stone-700">주소</label>

              {campaign.hasAddress == null && (
                <div className="text-sm text-stone-700">
                  배송지 확인을 위해{" "}
                  <Link
                    to={`/login?redirect=/campaigns/${id}/apply`}
                    className="text-sky-600 underline"
                  >
                    로그인
                  </Link>
                  이 필요합니다.
                </div>
              )}

              {campaign.hasAddress === false && (
                <>
                  {/* 우편번호 + 검색 */}
                  <div className="flex gap-2">
                    <input
                      value={addr.zipCode}
                      readOnly
                      placeholder="우편번호 (검색버튼을 눌러 입력해 주세요.)"
                      className="flex-1 h-11 rounded-md border border-stone-300 bg-stone-50 px-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await openPostcode(({ zonecode, address }) => {
                            setAddr((s) => ({ ...s, zipCode: zonecode, address }));
                          });
                        } catch {
                          alert("주소 검색 실패");
                        }
                      }}
                      className="w-24 h-11 rounded-md border border-stone-400 bg-white text-sm font-medium hover:bg-stone-50"
                    >
                      검색
                    </button>
                  </div>

                  {/* 기본 주소 */}
                  <input
                    value={addr.address}
                    readOnly
                    placeholder="기본 주소 (검색버튼을 눌러 입력해 주세요.)"
                    className="h-11 w-full rounded-md border border-stone-300 bg-stone-50 px-3 text-sm placeholder:text-stone-400"
                  />

                  {/* 상세 주소 */}
                  <input
                    value={addr.detailAddress}
                    onChange={(e) => setAddr((s) => ({ ...s, detailAddress: e.target.value }))}
                    placeholder="상세 주소"
                    className="h-11 w-full rounded-md border border-stone-300 px-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </>
              )}
            </section>
          )}

          {/* 체크박스 */}
          <div className="mt-8 space-y-4">
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              체험단 유의사항, 개인정보 및 콘텐츠 3자 제공, 저작물 이용에 동의합니다.{" "}
              <Link
                to={`/policies/experience-terms`}
                target="_blank"
                className="text-sky-600 underline"
              >
                자세히 보기
              </Link>
            </label>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={agreeMission}
                onChange={(e) => setAgreeMission(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />
              체험단 미션을 모두 확인했습니다.{" "}
              {campaign.productUrl ? (
                <a
                  href={campaign.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 underline"
                >
                  상세 미션 보기 <FiExternalLink className="inline" />
                </a>
              ) : (
                <span className="text-stone-400">상세 미션 링크 없음</span>
              )}
            </label>
          </div>

          {/* 버튼 */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit || loading}
            className={`mt-8 w-full h-11 rounded-xl text-sm font-semibold ${
              canSubmit
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "cursor-not-allowed bg-stone-200 text-stone-500"
            }`}
          >
            {campaign.alreadyApplied
              ? "이미 신청 완료"
              : campaign.allowApply === false
              ? "신청 불가 (기간/상태)"
              : isLoggedIn
              ? "체험단 신청"
              : "로그인 필요"}
          </button>

          {campaign.allowApply === false && (
            <div className="mt-2 text-xs text-stone-500">
              현재 모집 상태 또는 신청 기간이 아닙니다.
            </div>
          )}

          {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}
        </div>

        {/* 우측: 요약 카드 */}
        <aside className="overflow-hidden rounded-2xl   bg-white ">
          <div className="relative">
            <img
              src={toAbsoluteUrl(campaign.thumbnailUrl)}
              alt=""
              className="aspect-[16/10] w-full object-cover border rounded-md"
            />
            <div className="absolute left-3 top-3">
              <Badge tone="biggreen">{campaign.campaignTypeName}</Badge>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 text-xs text-stone-500">
              신청 {campaign.applicants?.toLocaleString?.() ?? 0} / 모집{" "}
              {campaign.recruitCount ?? "-"}
            </div>

            <div className="line-clamp-2 text-[15px] font-semibold leading-snug text-stone-900">
              {campaign.title}
            </div>

            <div className="mt-1 text-xs text-stone-500">{campaign.shopName}</div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="slate">{campaign.channelName}</Badge>
              
              {campaign.categoryName && (
                <Badge tone="stone">{campaign.categoryName}</Badge>
              )}
            </div>

            {campaign.benefitDetail && (
              <div className="mt-3 rounded-md bg-stone-50 px-2 py-1.5 text-xs text-stone-700">
                {campaign.benefitDetail}
              </div>
            )}

            <div className="mt-3">
              {campaign.productUrl ? (
                <a
                  href={campaign.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 underline"
                >
                  자세히 보기
                  <FiExternalLink className="inline h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-xs text-stone-400">상세 링크 없음</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

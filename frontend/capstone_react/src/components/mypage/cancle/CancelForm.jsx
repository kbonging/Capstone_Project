// src/pages/.../CancelForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { fetchRunningCampaigns, createCancel } from "../../../api/reviewerApi";

export default function CancelForm() {
  const token = localStorage.getItem("token") || undefined;

  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  const [type, setType] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingCampaigns(true);
        setLoadErr("");

        if (!token) {
          setLoadErr("로그인이 필요합니다.");
          setCampaigns([]);
          return;
        }

        const data = await fetchRunningCampaigns({
          token,
          withCredentials: true,
        });
        if (!alive) return;

        const normalized = Array.isArray(data)
          ? data.map((row) => ({
              id: row.id ?? row.campaignId,
              title: row.title,
            }))
          : [];

        setCampaigns(normalized);
      } catch (e) {
        if (!alive) return;
        setLoadErr(e.message || "진행중 캠페인 로드 실패");
      } finally {
        if (alive) setLoadingCampaigns(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const hasRunning = campaigns.length > 0 && !loadingCampaigns;

  const onFilesChange = (fileList) => {
    const valid = Array.from(fileList).filter((f) => {
      const okExt = /image\/(jpeg|png)/i.test(f.type);
      const okSize = f.size <= 5 * 1024 * 1024;
      return okExt && okSize;
    });
    setFiles(valid.slice(0, 4));
  };

  const onDrop = (e) => {
    e.preventDefault();
    onFilesChange(e.dataTransfer.files);
  };

  const resetForm = () => {
    setType("");
    setCampaignId("");
    setReason("");
    setFiles([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("native fetch?", /\[native code\]/.test(fetch.toString()));
    console.log("sw controlled?", !!navigator.serviceWorker?.controller);

    setErrorMsg("");
    setOkMsg("");

    if (!token) {
      setErrorMsg("로그인이 필요합니다.");
      return;
    }

    if (!type) return alert("유형을 선택해 주세요.");
    if (!campaignId) return alert("체험단을 선택해 주세요.");
    if (type === "NEGOTIATED" && !reason.trim()) {
      return alert("취소 사유를 입력해 주세요.");
    }

    try {
      setSubmitting(true);

      await createCancel(
        { type, campaignId, reason, files },
        { token, withCredentials: true }
      );

      setOkMsg("취소가 접수되었습니다.");
      resetForm();
    } catch (err) {
      setErrorMsg(err.message || "처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto">
      <h2 className="text-[18px] font-semibold">체험 취소하기</h2>
      <div className="mt-2 h-px bg-gray-200" />

      {errorMsg && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMsg}
        </div>
      )}
      {okMsg && (
        <div className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {okMsg}
        </div>
      )}

      {/* 유형 */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">유형</label>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={submitting}
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:opacity-60"
          >
            <option value="">선택</option>
            <option value="SIMPLE">단순취소 (취소횟수 부과)</option>
            <option value="NEGOTIATED">협의취소 (취소횟수 없음)</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▾
          </span>
        </div>
      </div>

      {/* 체험단 */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">체험단</label>

        {loadingCampaigns ? (
          <div className="text-sm text-gray-500">불러오는 중…</div>
        ) : loadErr ? (
          <div className="text-sm text-red-500">{loadErr}</div>
        ) : hasRunning ? (
          <div className="relative">
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              disabled={submitting}
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:opacity-60"
            >
              <option value="">체험단을 선택해 주세요.</option>
              {campaigns.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>
        ) : (
          <>
            <input
              disabled
              placeholder="체험단을 선택해 주세요."
              className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-400"
            />
            <p className="mt-2 text-sm text-gray-500">
              진행중인 체험단이 없습니다
            </p>
          </>
        )}
      </div>

      {/* 단순취소 경고문 */}
      {type === "SIMPLE" && (
        <p className="mt-6 text-sm text-red-500">
          단순 취소 신청은 철회가 불가하므로 신중하게 신청해 주세요.
          <br />
          중복 선정 · 추가 선정 · 추가 가이드 전달 등 사유는 단순 취소가 아닌{" "}
          <b>협의 취소</b>로 신청해 주세요.
        </p>
      )}

      {/* 협의취소 전용 */}
      {type === "NEGOTIATED" && (
        <>
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              취소 사유 작성
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              placeholder="취소 사유를 입력하세요"
              disabled={submitting}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:opacity-60"
            />
            {!reason.trim() && (
              <p className="mt-2 text-xs text-red-500">필수 입력 사항입니다.</p>
            )}
          </div>

          {/* 이미지 업로드 */}
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              협의 내용 이미지 첨부
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="grid gap-3"
            >
              <div
                className="flex flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 px-4 py-10 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-3xl">🖼️</div>
                <div className="mt-2 text-sm">
                  <span className="underline">클릭</span> 하거나{" "}
                  <span className="underline">드래그/드롭</span> 해주세요
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  5MB 이하의 JPEG, PNG 파일
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilesChange(e.target.files)}
                  disabled={submitting}
                />
              </div>

              {files.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {files.map((f, idx) => {
                    const url = URL.createObjectURL(f);
                    return (
                      <li
                        key={idx}
                        className="relative overflow-hidden rounded border"
                        title={f.name}
                      >
                        <img
                          src={url}
                          alt={f.name}
                          className="block w-full h-36 object-cover"
                          onLoad={() => URL.revokeObjectURL(url)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[11px] text-white px-2 py-1 truncate">
                          {f.name}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          className="rounded bg-sky-500 px-6 py-3 text-white text-sm font-semibold hover:bg-sky-600 disabled:opacity-50"
          disabled={
            submitting ||
            loadingCampaigns ||
            !type ||
            !campaignId ||
            (type === "NEGOTIATED" && !reason.trim()) ||
            !hasRunning
          }
        >
          {submitting ? "처리 중..." : "취소하기"}
        </button>
      </div>
    </form>
  );
}

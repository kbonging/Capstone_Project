// src/features/campaigns/components/MissionIconsGrid.jsx
export default function MissionIconsGrid({ spec, missionHtml, missionRaw }) {
  const tabs = spec?.tabs ?? [];
  if (!tabs.length) return null;

  const gridCols = (n) =>
    n <= 3 ? "grid-cols-3"
    : n <= 4 ? "grid-cols-4 mb-14"
    : n <= 5 ? "grid-cols-5 mb-14"
    : "grid-cols-6 mb-10";

  // ────────────────── 유틸: 원시 텍스트 → 안전한 HTML ──────────────────
  const escapeHtml = (s = "") =>
    s.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;");

  // URL을 자동 링크로 바꾸기
  const linkify = (s) =>
    s.replace(
      /(https?:\/\/[^\s)]+)(\)?)/g,
      (m, url, tail = "") => `<a href="${url}" target="_blank" rel="noreferrer" class="text-sky-600 underline underline-offset-2 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200">${url}</a>${tail}`
    );

  // "- 라벨 : 값" 패턴 볼드 처리
  const boldifyLabelColon = (s) => s.replace(/^-\s*([^:\n]+)\s*:\s*(.+)$/u, (_m, k, v) => `- <strong>${k.trim()}</strong>: ${v.trim()}`);

  // 원시 미션 텍스트를 <h4>, <ul><li>, <p>로 구성
  const normalizeMissionHtml = (raw = "") => {
    if (!raw) return "";

    // 접두 "mission:" 제거 + 개행 정리
    let t = raw.replace(/^mission\s*:\s*/i, "").replace(/\r\n?/g, "\n").trim();

    // 1차 escape
    t = escapeHtml(t);

    // 줄 단위 파싱
    const lines = t.split("\n");

    let html = "";
    let inList = false;

    const closeList = () => {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
    };

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        // 빈 줄 → 단락 구분
        closeList();
        continue;
      }

      // ▶ 머리말 → h3
      if (/^▶/.test(trimmed)) {
        closeList();
        const text = trimmed.replace(/^▶\s*/, "");
        html += `<h3 class="text-base font-semibold">${text}</h3>`;
        continue;
      }

      // "1. 제목" / "2. 제목" → h4
      const mNum = trimmed.match(/^\d+\.\s*(.+)$/);
      if (mNum) {
        closeList();
        html += `<h4 class="text-sm font-semibold mt-3">${mNum[1]}</h4>`;
        continue;
      }

      // 불릿(-, •) → <ul><li>
      if (/^[-•]\s+/.test(trimmed)) {
        if (!inList) {
          html += `<ul class="my-2 list-disc pl-5">`;
          inList = true;
        }
        // 라벨:값 볼드 처리 → 링크화
        let li = boldifyLabelColon(trimmed);
        li = li.replace(/^[-•]\s+/, ""); // 불릿 표시는 제거하고 <li>로
        li = linkify(li);
        html += `<li>${li}</li>`;
        continue;
      }

      // 그 외 일반 문장 → <p>
      closeList();
      html += `<p>${linkify(trimmed)}</p>`;
    }

    closeList();
    return html;
  };

  // 최종 렌더링할 HTML (missionHtml 우선, 없으면 missionRaw 파싱)
  const finalHtml = missionHtml ?? normalizeMissionHtml(missionRaw);

  return (
    <div className="space-y-6">
      {tabs.map((tab, idx) => (
        <div key={idx}>
          {/* 섹션 헤더바 */}
          <div className="mb-5 w-full rounded bg-stone-200 py-1 text-center text-sm font-medium text-stone-700
                          dark:bg-zinc-800 dark:text-zinc-200">
            {tab.label}
          </div>

          {/* 아이콘 그리드 */}
          <div
            className={`grid gap-4 text-center text-xs font-medium text-stone-700 dark:text-zinc-300 ${gridCols(
              tab.items.length
            )}`}
            role="list"
          >
            {tab.items.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                role="listitem"
                className="flex flex-col items-center gap-1"
                title={text}
                aria-label={text}
              >
                {Icon ? (
                  <Icon size={24} className="text-stone-800 dark:text-zinc-100" />
                ) : (
                  <div className="h-6 w-6 rounded bg-stone-200 dark:bg-zinc-700" />
                )}
                <span className="leading-4">{text}</span>
              </div>
            ))}
          </div>

          {/* 마지막 섹션에만 미션 HTML/RAW */}
          {idx === tabs.length - 1 && (finalHtml?.trim()?.length > 0) && (
            <div
              className="mt-4 prose prose-sm max-w-none prose-li:marker:text-stone-400
                         dark:prose-invert dark:prose-li:marker:text-zinc-500"
              dangerouslySetInnerHTML={{ __html: finalHtml }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

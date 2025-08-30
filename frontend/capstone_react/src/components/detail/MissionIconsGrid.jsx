// src/features/campaigns/components/MissionIconsGrid.jsx
export default function MissionIconsGrid({ spec, missionHtml }) {
  if (!spec) return null;
  return (
    <div className="space-y-6">
      {spec.tabs.map((tab, idx) => (
        <div key={idx}>
          <div className="mb-5 w-full rounded bg-stone-200 py-1 text-center text-sm font-medium text-stone-700">
            {tab.label}
          </div>
          <div
            className={`grid  text-center text-xs font-medium text-stone-700 ${
              tab.items.length <= 3
                ? "grid-cols-3"
                : tab.items.length <= 4
                ? "grid-cols-4 mb-14"
                : tab.items.length <= 5
                ? "grid-cols-5 mb-14"
                : "grid-cols-6 mb-10"
            }`}
          >
            {tab.items.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex flex-col items-center gap-1 ">
                <Icon size={22} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          {idx === spec.tabs.length - 1 && missionHtml && (
            <div
              className="mt-4 prose prose-sm max-w-none prose-li:marker:text-stone-400"
              dangerouslySetInnerHTML={{ __html: missionHtml }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

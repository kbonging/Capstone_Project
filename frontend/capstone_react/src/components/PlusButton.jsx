/* ===== + 버튼 (공용) ===== */
export function PlusButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      aria-label="더보기"
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md  ",
        "px-5 py-3",
        "text-stone-700 dark:text-zinc-100",
        "bg-white dark:bg-zinc-800",
        "hover:bg-gray-100 hover:border dark:hover:bg-zinc-700",
        className,
      ].join(" ")}
    >
      <span className="text-base font-medium">더보기</span>
      {/* + 아이콘 강제 중앙 보정 */}
      <span className="text-2xl leading-none relative top-[-2px]">+</span>
    </button>
  );
}

import React from "react";

export default function Badge({ children, tone = "green" }) {
  const tones = {
    green: `
      bg-emerald-50 text-emerald-700 border-emerald-200
      dark:bg-emerald-900/30 dark:text-emerald-500 dark:border-emerald-700
    `,
    blue: `
      bg-sky-50 text-sky-700 border-sky-200
      dark:bg-sky-900/30 dark:text-sky-500 dark:border-sky-700
    `,
    slate: `
      bg-stone-50 text-stone-700 border-stone-200
      dark:bg-zinc-800/60 dark:text-zinc-300 dark:border-zinc-700
    `,
    red: `
      bg-rose-50 text-rose-700 border-rose-200
      dark:bg-rose-900/30 dark:text-rose-500 dark:border-rose-700
    `,
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border px-2 py-0.5
        text-[10px] font-medium
        ${tones[tone]}
      `}
    >
      {children}
    </span>
  );
}

import React from "react";

export default function Main({ children }) {
  return (
    <main className="container mx-auto px-4 py-6 bg-white dark:bg-zinc-800 ">
      {children}
    </main>
  );
}

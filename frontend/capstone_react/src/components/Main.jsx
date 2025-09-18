import React from "react";

export default function Main({ children }) {
  return (
    <main className=" mx-auto overflow-visible bg-white dark:bg-zinc-800 ">
      {children}
    </main>
  );
}

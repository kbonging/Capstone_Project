import React from 'react';

export default function Main({ children }) {
  return (
    <main className="container mx-auto px-4 py-6">
      {children}
    </main>
  );
}
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sherlock GraphRAG',
  description: 'Interactive visualization of Standard RAG vs GraphRAG over The Adventures of Sherlock Holmes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-900">
        {children}
      </body>
    </html>
  );
}

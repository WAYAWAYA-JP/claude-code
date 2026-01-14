import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center">読み込み中...</div>}>
      <Dashboard />
    </Suspense>
  );
}

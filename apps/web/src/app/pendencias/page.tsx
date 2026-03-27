'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PendenciasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/carteira?pendenciaOperacional=true');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Pendencias</h1>
        <p className="text-sm text-slate-600">Abrindo carteira filtrada...</p>
      </section>
    </main>
  );
}

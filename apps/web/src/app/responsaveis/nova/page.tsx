'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import {
  createResponsavel,
  type ResponsavelInternoCreateInput
} from '@/lib/api';
import { requireSession, signOut } from '@/lib/auth';

type ResponsavelFormState = {
  ativo: boolean;
  email: string;
  nome: string;
  usuarioInternoId: string;
};

const initialFormState: ResponsavelFormState = {
  ativo: true,
  email: '',
  nome: '',
  usuarioInternoId: ''
};

function buildPayload(form: ResponsavelFormState): ResponsavelInternoCreateInput {
  return {
    ativo: form.ativo,
    email: form.email.trim(),
    nome: form.nome.trim(),
    usuarioInternoId: form.usuarioInternoId.trim()
  };
}

export default function NovoResponsavelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ResponsavelFormState>(initialFormState);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const user = await requireSession();

        if (active) {
          setForm((current) =>
            current.usuarioInternoId
              ? current
              : { ...current, usuarioInternoId: user.id }
          );
        }
      } catch (loadError) {
        if (
          active &&
          loadError instanceof Error &&
          loadError.message === 'Nao autenticado.'
        ) {
          router.replace('/login');
          return;
        }

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Falha ao validar sessao.'
          );
        }
        return;
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch {
      // Best effort logout; fall through to redirect.
    } finally {
      router.replace('/login');
      setIsSigningOut(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await createResponsavel(buildPayload(form));
      router.replace('/responsaveis');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao cadastrar responsavel.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Carregando sessao...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              ECAC AUTOMACAO
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Novo responsavel
            </h1>
            <p className="text-sm text-slate-600">
              Cadastro operacional minimo do responsavel interno.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
              href="/responsaveis"
            >
              Voltar
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSigningOut}
              onClick={() => void handleLogout()}
              type="button"
            >
              {isSigningOut ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Nome
                </span>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  name="nome"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nome: event.target.value
                    }))
                  }
                  required
                  type="text"
                  value={form.nome}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  name="email"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  required
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Usuario interno ID
                </span>
                <input
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  name="usuarioInternoId"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      usuarioInternoId: event.target.value
                    }))
                  }
                  placeholder="Preenchido com a sessao atual"
                  required
                  type="text"
                  value={form.usuarioInternoId}
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2">
                <input
                  checked={form.ativo}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  name="ativo"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      ativo: event.target.checked
                    }))
                  }
                  type="checkbox"
                />
                <span className="text-sm font-medium text-slate-700">
                  Ativo
                </span>
              </label>
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Salvando...' : 'Cadastrar'}
              </button>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                href="/responsaveis"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

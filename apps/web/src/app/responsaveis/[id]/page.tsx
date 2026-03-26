'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  getResponsavel,
  updateResponsavel,
  type ResponsavelInternoCreateInput,
  type ResponsavelInternoRecord
} from '@/lib/api';
import { requireSession, signOut } from '@/lib/auth';
import { formatDateTime } from '@/lib/formatters';

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

function toFormState(responsavel: ResponsavelInternoRecord): ResponsavelFormState {
  return {
    ativo: responsavel.ativo,
    email: responsavel.email,
    nome: responsavel.nome,
    usuarioInternoId: responsavel.usuarioInternoId
  };
}

export default function ResponsavelDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const responsavelId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [responsavel, setResponsavel] = useState<ResponsavelInternoRecord | null>(
    null
  );
  const [form, setForm] = useState<ResponsavelFormState>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      if (!responsavelId) {
        if (active) {
          setError('Responsavel invalido.');
          setLoading(false);
        }
        return;
      }

      try {
        await requireSession();
        const data = await getResponsavel(responsavelId);

        if (!active) {
          return;
        }

        setResponsavel(data);
        setForm(toFormState(data));
      } catch (loadError) {
        if (!active) {
          return;
        }

        if (
          loadError instanceof Error &&
          loadError.message === 'Nao autenticado.'
        ) {
          router.replace('/login');
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Falha ao carregar responsavel.'
        );
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
  }, [responsavelId, router]);

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
    setMessage('');
    setIsSaving(true);

    try {
      if (!responsavelId) {
        throw new Error('Responsavel invalido.');
      }

      const updated = await updateResponsavel(responsavelId, buildPayload(form));
      setResponsavel(updated);
      setForm(toFormState(updated));
      setMessage('Responsavel atualizado com sucesso.');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao atualizar responsavel.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Carregando responsavel...</p>
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
              {responsavel?.nome ?? 'Editar responsavel'}
            </h1>
            <p className="text-sm text-slate-600">
              Visualizacao e edicao basica do responsavel interno.
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

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        {responsavel ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Dados do responsavel
                </h2>
                <p className="text-sm text-slate-600">
                  Informacoes atuais vindas da API.
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Email
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {responsavel.email}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {responsavel.ativo ? 'Ativo' : 'Inativo'}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Usuario interno
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {responsavel.usuarioInterno.nome} (
                    {responsavel.usuarioInterno.email})
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Usuario interno ID
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {responsavel.usuarioInternoId}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Atualizacao
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatDateTime(responsavel.updatedAt)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Criacao
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatDateTime(responsavel.createdAt)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Edicao basica
                </h2>
                <p className="text-sm text-slate-600">
                  Atualize os campos principais do cadastro.
                </p>
              </div>

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

                <div className="flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSaving}
                    type="submit"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
                  </button>
                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                    href="/responsaveis"
                  >
                    Voltar
                  </Link>
                </div>
              </form>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

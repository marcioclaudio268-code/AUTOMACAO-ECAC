'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import {
  createCompany,
  listResponsaveis,
  type CompanyCreateInput,
  type RegimeTributario,
  type ResponsavelInternoRecord,
  type StatusAcessoEmpresa,
  type StatusProcuracaoEmpresa
} from '@/lib/api';
import { requireSession, signOut } from '@/lib/auth';
import {
  REGIME_TRIBUTARIO_OPTIONS,
  STATUS_ACESSO_OPTIONS,
  STATUS_PROCURACAO_OPTIONS
} from '@/lib/constants';
import { validateCompanyForm } from '@/lib/validators';

type CompanyFormState = {
  cnpj: string;
  naCarteira: boolean;
  nomeFantasia: string;
  observacoesOperacionais: string;
  razaoSocial: string;
  regimeTributario: RegimeTributario;
  responsavelInternoId: string;
  statusAcesso: StatusAcessoEmpresa;
  statusProcuracao: StatusProcuracaoEmpresa;
};

const initialFormState: CompanyFormState = {
  cnpj: '',
  naCarteira: false,
  nomeFantasia: '',
  observacoesOperacionais: '',
  razaoSocial: '',
  regimeTributario: 'SIMPLES_NACIONAL',
  responsavelInternoId: '',
  statusAcesso: 'NAO_VERIFICADO',
  statusProcuracao: 'NAO_VERIFICADA'
};

function buildPayload(form: CompanyFormState): CompanyCreateInput {
  return {
    cnpj: form.cnpj.trim(),
    naCarteira: form.naCarteira,
    nomeFantasia: form.nomeFantasia.trim() || undefined,
    observacoesOperacionais: form.observacoesOperacionais.trim() || undefined,
    razaoSocial: form.razaoSocial.trim(),
    regimeTributario: form.regimeTributario,
    responsavelInternoId: form.responsavelInternoId.trim() || undefined,
    statusAcesso: form.statusAcesso,
    statusProcuracao: form.statusProcuracao
  };
}

function formatResponsavelOption(responsavel: ResponsavelInternoRecord) {
  return `${responsavel.nome} (${responsavel.email})${
    responsavel.ativo ? '' : ' - Inativo'
  }`;
}

export default function NovaEmpresaPage() {
  const router = useRouter();
  const submitLockRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [responsaveis, setResponsaveis] = useState<ResponsavelInternoRecord[]>(
    []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CompanyFormState>(initialFormState);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await requireSession();

        const items = await listResponsaveis();

        if (!active) {
          return;
        }

        setResponsaveis(items);
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

    if (submitLockRef.current) {
      return;
    }

    const validationError = validateCompanyForm(form, responsaveis);

    if (validationError) {
      setError(validationError);
      return;
    }

    submitLockRef.current = true;
    setIsSaving(true);

    try {
      const created = await createCompany(buildPayload(form));
      router.replace(`/empresas/${created.id}?flash=created:${created.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao cadastrar empresa.'
      );
    } finally {
      submitLockRef.current = false;
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
              ECAC AUTOMAÇÃO
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Nova empresa
            </h1>
            <p className="text-sm text-slate-600">
              Cadastro operacional minimo para a carteira.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
              href="/empresas"
            >
              Voltar
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
              href="/responsaveis"
            >
              Responsaveis
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
              href="/carteira"
            >
              Carteira
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
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <fieldset className="space-y-5" disabled={isSaving}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    CNPJ
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="cnpj"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        cnpj: event.target.value
                      }))
                    }
                    required
                    type="text"
                    value={form.cnpj}
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Razao social
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="razaoSocial"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        razaoSocial: event.target.value
                      }))
                    }
                    required
                    type="text"
                    value={form.razaoSocial}
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Nome fantasia
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="nomeFantasia"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        nomeFantasia: event.target.value
                      }))
                    }
                    type="text"
                    value={form.nomeFantasia}
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Responsavel interno (opcional)
                  </span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="responsavelInternoId"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        responsavelInternoId: event.target.value
                      }))
                    }
                    value={form.responsavelInternoId}
                  >
                    <option value="">
                      {responsaveis.length === 0
                        ? 'Sem responsavel cadastrado'
                        : 'Sem responsavel (opcional)'}
                    </option>
                    {responsaveis.map((responsavel) => (
                      <option key={responsavel.id} value={responsavel.id}>
                        {formatResponsavelOption(responsavel)}
                      </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2">
                    <input
                      checked={form.naCarteira}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      name="naCarteira"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          naCarteira: event.target.checked
                        }))
                      }
                      type="checkbox"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Na carteira operacional
                    </span>
                  </label>

                  <label className="space-y-2">
                    <span className="block text-sm font-medium text-slate-700">
                      Regime tributario
                  </span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="regimeTributario"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        regimeTributario: event.target.value as RegimeTributario
                      }))
                    }
                    value={form.regimeTributario}
                  >
                    {REGIME_TRIBUTARIO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Status de acesso
                  </span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="statusAcesso"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        statusAcesso: event.target.value as StatusAcessoEmpresa
                      }))
                    }
                    value={form.statusAcesso}
                  >
                    {STATUS_ACESSO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-medium text-slate-700">
                    Status de procuracao
                  </span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                    name="statusProcuracao"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        statusProcuracao:
                          event.target.value as StatusProcuracaoEmpresa
                      }))
                    }
                    value={form.statusProcuracao}
                  >
                    {STATUS_PROCURACAO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Observacoes operacionais
                </span>
                <textarea
                  className="min-h-32 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                  name="observacoesOperacionais"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      observacoesOperacionais: event.target.value
                    }))
                  }
                  value={form.observacoesOperacionais}
                />
              </label>

              {error ? (
                <p
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                aria-busy={isSaving}
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Salvando...' : 'Cadastrar'}
              </button>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                href="/empresas"
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

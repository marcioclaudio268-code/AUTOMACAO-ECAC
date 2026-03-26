'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { requireSession, signOut } from '@/lib/auth';
import {
  getCompany,
  listResponsaveis,
  updateCompany,
  type CompanyCreateInput,
  type CompanyDetailItem,
  type RegimeTributario,
  type ResponsavelInternoRecord,
  type StatusAcessoEmpresa,
  type StatusProcuracaoEmpresa
} from '@/lib/api';
import {
  REGIME_TRIBUTARIO_OPTIONS,
  STATUS_ACESSO_LABELS,
  STATUS_ACESSO_OPTIONS,
  STATUS_PROCURACAO_LABELS,
  STATUS_PROCURACAO_OPTIONS
} from '@/lib/constants';
import { formatCnpj, formatDateTime } from '@/lib/formatters';

type CompanyFormState = {
  cnpj: string;
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
    nomeFantasia: form.nomeFantasia.trim() || undefined,
    observacoesOperacionais: form.observacoesOperacionais.trim() || undefined,
    razaoSocial: form.razaoSocial.trim(),
    regimeTributario: form.regimeTributario,
    responsavelInternoId: form.responsavelInternoId.trim() || undefined,
    statusAcesso: form.statusAcesso,
    statusProcuracao: form.statusProcuracao
  };
}

function toFormState(company: CompanyDetailItem): CompanyFormState {
  return {
    cnpj: company.cnpj,
    nomeFantasia: company.nomeFantasia ?? '',
    observacoesOperacionais: company.observacoesOperacionais ?? '',
    razaoSocial: company.razaoSocial,
    regimeTributario: company.regimeTributario,
    responsavelInternoId: company.responsavelInterno?.id ?? '',
    statusAcesso: company.statusAcesso,
    statusProcuracao: company.statusProcuracao
  };
}

function formatResponsavelOption(responsavel: ResponsavelInternoRecord) {
  return `${responsavel.nome} (${responsavel.email})${
    responsavel.ativo ? '' : ' - Inativo'
  }`;
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const companyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [company, setCompany] = useState<CompanyDetailItem | null>(null);
  const [responsaveis, setResponsaveis] = useState<ResponsavelInternoRecord[]>(
    []
  );
  const [form, setForm] = useState<CompanyFormState>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      if (!companyId) {
        if (active) {
          setError('Empresa invalida.');
          setLoading(false);
        }
        return;
      }

      try {
        await requireSession();
        const data = await getCompany(companyId);

        if (!active) {
          return;
        }

        setCompany(data);
        setForm(toFormState(data));

        try {
          const items = await listResponsaveis();

          if (active) {
            setResponsaveis(items);
          }
        } catch (responsaveisError) {
          if (!active) {
            return;
          }

          setError(
            responsaveisError instanceof Error
              ? responsaveisError.message
              : 'Falha ao carregar responsaveis.'
          );
        }
      } catch (loadError) {
        if (!active) {
          return;
        }

        if (loadError instanceof Error && loadError.message === 'Nao autenticado.') {
          router.replace('/login');
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Falha ao carregar empresa.'
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
  }, [companyId, router]);

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
      if (!companyId) {
        throw new Error('Empresa invalida.');
      }

      const updated = await updateCompany(companyId, buildPayload(form));
      setCompany(updated);
      setForm(toFormState(updated));
      setMessage('Empresa atualizada com sucesso.');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Falha ao atualizar empresa.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Carregando empresa...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              ECAC AUTOMAÇÃO
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              {company?.razaoSocial ?? 'Detalhe da empresa'}
            </h1>
            <p className="text-sm text-slate-600">
              Visualizacao e edicao basica do cadastro operacional.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
              href="/empresas"
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

        {company ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Dados da empresa
                </h2>
                <p className="text-sm text-slate-600">
                  Informacoes atuais vindas da API.
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    CNPJ
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatCnpj(company.cnpj)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Regime tributario
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {company.regimeTributario}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Status de acesso
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {STATUS_ACESSO_LABELS[company.statusAcesso]}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Status de procuracao
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {STATUS_PROCURACAO_LABELS[company.statusProcuracao]}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Responsavel interno
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {company.responsavelInterno
                      ? company.responsavelInterno.nome
                      : '-'}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Atualizacao
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatDateTime(company.updatedAt)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Ultima varredura
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatDateTime(company.ultimaVarreduraEm)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Ultimo evento
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {formatDateTime(company.ultimoEventoRelevanteEm)}
                  </dd>
                </div>
              </dl>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Observacoes operacionais
                </h3>
                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {company.observacoesOperacionais?.trim() || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Integracoes
                </h3>
                {company.integracoes.length === 0 ? (
                  <p className="text-sm text-slate-600">Sem integracoes registradas.</p>
                ) : (
                  <ul className="space-y-2">
                    {company.integracoes.map((integration) => (
                      <li
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        key={integration.id}
                      >
                        {integration.tipoIntegracao} - {integration.statusIntegracao}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                  Responsavel interno
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
                      : 'Sem responsavel'}
                  </option>
                  {responsaveis.map((responsavel) => (
                    <option key={responsavel.id} value={responsavel.id}>
                      {formatResponsavelOption(responsavel)}
                    </option>
                  ))}
                </select>
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
                          regimeTributario:
                            event.target.value as RegimeTributario
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
                          statusAcesso:
                            event.target.value as StatusAcessoEmpresa
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
                    {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
                  </button>
                  <Link
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                    href="/empresas"
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

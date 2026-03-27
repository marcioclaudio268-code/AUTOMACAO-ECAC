import type {
  RegimeTributario,
  PendenciaTipo,
  StatusAcessoEmpresa,
  StatusProcuracaoEmpresa
} from '@/lib/api';

type Option<T extends string> = {
  label: string;
  value: T;
};

export const REGIME_TRIBUTARIO_OPTIONS: Option<RegimeTributario>[] = [
  { label: 'Simples Nacional', value: 'SIMPLES_NACIONAL' },
  { label: 'Lucro Presumido', value: 'LUCRO_PRESUMIDO' },
  { label: 'Lucro Real', value: 'LUCRO_REAL' },
  { label: 'Outro', value: 'OUTRO' }
];

export const STATUS_ACESSO_OPTIONS: Option<StatusAcessoEmpresa>[] = [
  { label: 'Disponivel', value: 'DISPONIVEL' },
  { label: 'Indisponivel', value: 'INDISPONIVEL' },
  { label: 'Bloqueado', value: 'BLOQUEADO' },
  { label: 'Nao verificado', value: 'NAO_VERIFICADO' }
];

export const STATUS_PROCURACAO_OPTIONS: Option<StatusProcuracaoEmpresa>[] = [
  { label: 'Valida', value: 'VALIDA' },
  { label: 'Invalida', value: 'INVALIDA' },
  { label: 'Pendente', value: 'PENDENTE' },
  { label: 'Nao verificada', value: 'NAO_VERIFICADA' }
];

export const PENDENCIA_TIPO_OPTIONS: Option<PendenciaTipo>[] = [
  { label: 'Acesso', value: 'ACESSO' },
  { label: 'Operacional', value: 'OPERACIONAL' },
  { label: 'Procuracao', value: 'PROCURACAO' }
];

export const STATUS_ACESSO_LABELS: Record<StatusAcessoEmpresa, string> = {
  BLOQUEADO: 'Bloqueado',
  DISPONIVEL: 'Disponivel',
  INDISPONIVEL: 'Indisponivel',
  NAO_VERIFICADO: 'Nao verificado'
};

export const STATUS_PROCURACAO_LABELS: Record<
  StatusProcuracaoEmpresa,
  string
> = {
  INVALIDA: 'Invalida',
  NAO_VERIFICADA: 'Nao verificada',
  PENDENTE: 'Pendente',
  VALIDA: 'Valida'
};

export const PENDENCIA_TIPO_LABELS: Record<PendenciaTipo, string> = {
  ACESSO: 'Acesso',
  OPERACIONAL: 'Operacional',
  PROCURACAO: 'Procuracao'
};

export function normalizeCnpj(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value).replace(/\D/g, '');
}

export function isBasicCnpj(value: string): boolean {
  return /^\d{14}$/.test(value);
}


'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        body: JSON.stringify({
          email,
          senha
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;

      if (!response.ok) {
        const message = data?.message;
        throw new Error(
          Array.isArray(message) ? message[0] : message || 'Falha no login.'
        );
      }

      router.replace('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha no login.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="senha">Senha</label>
          <input
            autoComplete="current-password"
            id="senha"
            name="senha"
            onChange={(event) => setSenha(event.target.value)}
            type="password"
            value={senha}
          />
        </div>
        <button disabled={isSubmitting} type="submit">
          Entrar
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </form>
    </main>
  );
}

# Operacao local

## Portas padrao

- API: `3001`
- Web: `3002`

## Como subir

1. Suba a API:
   `corepack pnpm dev:api`
2. Suba o frontend:
   `corepack pnpm dev:web`

## Como validar rapido

1. Health da API:
   `Invoke-WebRequest http://localhost:3001/health`
2. Login no frontend:
   `http://localhost:3002/login`
3. Depois do login, confirme:
   - `http://localhost:3002/empresas`
   - `http://localhost:3002/responsaveis`

## Se uma porta estiver ocupada

1. Confira quem esta usando:
   `Get-NetTCPConnection -LocalPort 3001,3002 -State Listen`
2. Identifique o processo com o `OwningProcess`.
3. Se a porta `3000` estiver ocupada por outro workspace, nao force o ECAC nela.
4. O ECAC usa `3002` no frontend justamente para reduzir esse conflito.

## Sinais de ambiente correto

- A API responde `status=ok` e `database=ok` em `/health`.
- O frontend abre em `http://localhost:3002`.
- O login seedado continua em funcionamento.
- As listas de empresas e responsaveis carregam sem erro bloqueante.

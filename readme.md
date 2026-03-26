# ECAC AUTOMAÇÃO

Sistema interno para escritório contábil focado em **varredura automatizada da carteira**, **consolidação de pendências fiscais**, **acompanhamento de parcelamentos**, **identificação de dívida ativa** e **organização da apuração mensal por prioridade**.

O objetivo do projeto é reduzir trabalho manual, repetitivo e disperso, transformando a operação em **fila de exceção**: o time atua apenas onde houver evento, risco, pendência ou necessidade real de tratamento.

---

## Objetivo
Centralizar a rotina operacional de acompanhamento fiscal de empresas com procuração válida, permitindo que o escritório:

- visualize rapidamente o status da carteira
- identifique pendências sem abrir vários portais manualmente
- acompanhe parcelamentos de forma centralizada
- identifique sinais de dívida ativa
- organize a apuração mensal por prioridade
- mantenha histórico e rastreabilidade das ações

---

## Problema que o sistema resolve
Hoje o escritório precisa repetir, empresa por empresa:

- consultas manuais recorrentes
- conferência de pendências
- conferência de parcelamentos
- conferência de dívida ativa
- rechecagem de empresas sem alteração real
- organização paralela da apuração

Esse processo consome tempo, gera retrabalho e dificulta escala operacional sobre uma carteira grande.

O ECAC AUTOMAÇÃO existe para substituir a varredura cega por monitoramento estruturado.

---

## Princípio do projeto
**Confiabilidade operacional primeiro, limpeza estrutural em seguida.**

Toda decisão técnica deve priorizar:

1. estabilidade
2. rastreabilidade
3. simplicidade operacional
4. controle de execução
5. redução de trabalho manual

---

## Escopo da V1
A V1 é um **hub operacional fiscal interno**.

Ela deve conter:

- cadastro central de empresas
- controle de procurações e acessos
- dashboard principal da carteira
- motor de varredura
- painel de pendências
- painel de parcelamentos
- painel de dívida ativa
- workspace de apuração mensal
- histórico e auditoria
- alertas internos

Ela não deve conter:

- ERP completo
- CRM
- financeiro do escritório
- app mobile
- BI avançado
- automação irrestrita de todos os portais
- cálculo tributário avançado completo

---

## Resultado esperado
Ao final da V1, o sistema deve permitir:

- saber quais empresas estão OK
- saber quais empresas têm pendência
- saber quais empresas têm parcelamento relevante
- saber quais empresas têm indício de dívida ativa
- saber quais empresas estão bloqueadas para apuração
- saber onde o time deve agir primeiro

---

## Fluxo principal
O fluxo central do sistema é:

**1. Varredura automática**  
O sistema percorre a carteira e atualiza o status das empresas.

**2. Geração de eventos**  
Toda alteração relevante gera evento operacional.

**3. Classificação de criticidade**  
Cada evento recebe prioridade.

**4. Fila de tratamento**  
As pendências entram em fila por prioridade e responsável.

**5. Tratamento humano**  
O analista atua apenas onde houver necessidade real.

**6. Atualização de status**  
O sistema registra histórico, evidência e novo estado operacional.

**7. Apuração organizada**  
A empresa segue para o fluxo mensal conforme seu status.

---

## Estrutura funcional da V1

### 1. Carteira de empresas
Base central da operação com:

- dados cadastrais mínimos
- regime tributário
- responsável interno
- status de acesso
- última varredura
- último evento relevante

### 2. Controle de acessos
Registro operacional de:

- procuração válida
- aptidão para consulta
- bloqueio por acesso
- necessidade de tratamento manual

### 3. Dashboard principal
Visão consolidada da carteira com indicadores operacionais.

### 4. Motor de varredura
Rotinas automáticas responsáveis por atualizar o status das empresas.

### 5. Painel de pendências
Fila central de tudo que exige ação humana.

### 6. Painel de parcelamentos
Consolidação por empresa da situação dos parcelamentos encontrados.

### 7. Painel de dívida ativa
Consolidação por empresa da situação de dívida ativa identificada.

### 8. Workspace de apuração
Organização do ciclo mensal da apuração por empresa e competência.

### 9. Auditoria e histórico
Registro das consultas, mudanças de status e ações relevantes.

### 10. Alertas internos
Sinalização de eventos críticos e operacionais.

---

## Entidades principais
A base estrutural do sistema considera:

- Empresa
- ResponsavelInterno
- IntegracaoEmpresa
- Varredura
- EventoOperacional
- Pendencia
- Parcelamento
- DividaAtiva
- CompetenciaApuracao
- TarefaOperacional
- Evidencia
- UsuarioInterno
- LogExecucao

---

## Prioridade de implementação
A ordem de construção da V1 deve ser:

### Etapa 1. Base estrutural
- repositório
- ambiente
- autenticação interna
- cadastro de empresas
- usuários
- banco de dados
- logs iniciais

### Etapa 2. Núcleo operacional
- dashboard principal
- controle de acessos e procurações
- motor de varredura
- painel de pendências
- histórico de execução

### Etapa 3. Integrações prioritárias
- leitura de parcelamentos
- leitura de dívida ativa
- normalização de retorno
- classificação de eventos

### Etapa 4. Organização da apuração
- workspace por competência
- checklist operacional
- bloqueios e status
- fluxo de apuração

### Etapa 5. Alertas e refinamento
- alertas automáticos
- filtros
- busca
- melhoria de usabilidade
- exportações simples

---

## Critério de sucesso
A V1 será considerada útil quando:

- reduzir significativamente a varredura manual da carteira
- reduzir consultas repetitivas
- antecipar identificação de pendências
- concentrar o time em casos com evento real
- organizar a apuração mensal por prioridade
- manter histórico suficiente para operação confiável

---

## Regra de decisão
Toda nova funcionalidade deve responder:

**Isso reduz trabalho manual recorrente, melhora a priorização operacional ou aumenta a confiabilidade da apuração?**

Se não, não entra na V1.

---

## Diretriz de desenvolvimento
Este projeto deve manter escopo controlado.

A prioridade não é “fazer tudo”.
A prioridade é colocar em produção um núcleo operacional estável, rastreável e realmente útil para a carteira atendida.

---

## Nome do projeto
**ECAC AUTOMAÇÃO**
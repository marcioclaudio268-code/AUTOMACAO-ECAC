# ROADMAP-V1.md

## Projeto
**ECAC AUTOMAÇÃO**

## Objetivo do roadmap
Definir a ordem exata de construção da V1, com foco em entregar valor operacional real no menor caminho possível, sem expandir escopo antes da hora.

---

## Meta da V1
Entregar um hub operacional fiscal interno capaz de:

- centralizar a carteira de empresas
- automatizar a varredura do status operacional
- consolidar pendências, parcelamentos e dívida ativa
- organizar a fila de tratamento
- apoiar a apuração mensal por prioridade
- manter rastreabilidade mínima para operação confiável

---

## Regra do roadmap
A ordem de implementação deve seguir esta lógica:

**base primeiro → operação principal depois → integração prioritária em seguida → apuração organizada por último → refinamento no final**

Nada que fuja dessa sequência deve ter prioridade maior.

---

# FASE 0 — PREPARAÇÃO DO PROJETO

## Objetivo
Criar a base segura do desenvolvimento antes de iniciar qualquer construção relevante.

## Entregas
- definir stack do projeto
- criar repositório
- configurar ambiente local
- configurar variáveis de ambiente
- definir convenções de nomeação
- definir estrutura inicial de pastas
- criar documento mestre de escopo
- criar roadmap da V1

## Saída esperada
Projeto pronto para iniciar desenvolvimento sem desorganização estrutural.

## Critério de conclusão
A fase termina quando o projeto já tiver:

- repositório organizado
- arquivos base de documentação
- decisão inicial de stack
- ambiente mínimo funcional

---

# FASE 1 — BASE ESTRUTURAL

## Objetivo
Levantar a fundação técnica do sistema.

## Entregas
- autenticação interna
- modelo de usuários
- modelo de empresas
- modelo de responsável interno
- banco de dados inicial
- migrations iniciais
- logs básicos
- estrutura de API
- estrutura inicial do frontend

## Escopo funcional da fase
O sistema ainda não precisa consultar nada externo.  
O foco aqui é criar a base que sustentará a operação.

## Entidades mínimas desta fase
- UsuarioInterno
- ResponsavelInterno
- Empresa
- IntegracaoEmpresa

## Telas mínimas desta fase
- login
- lista de empresas
- cadastro de empresa
- detalhe da empresa
- gestão simples de usuário interno

## Critério de conclusão
A fase termina quando já for possível:

- autenticar usuário interno
- cadastrar empresa
- listar empresas
- associar responsável
- registrar status operacional básico de acesso

---

# FASE 2 — NÚCLEO OPERACIONAL

## Objetivo
Construir o primeiro bloco que gera valor visível no escritório.

## Entregas
- dashboard principal
- status consolidado da carteira
- motor de varredura inicial
- entidade de varredura
- entidade de evento operacional
- entidade de pendência
- painel de pendências
- histórico de execução

## Escopo funcional da fase
Mesmo que as integrações ainda estejam parciais, o sistema já deve conseguir simular ou registrar o fluxo operacional interno.

## Telas desta fase
- dashboard principal
- painel de pendências
- histórico de varreduras
- detalhe operacional da empresa

## Regras principais desta fase
- toda varredura gera registro
- todo evento relevante gera histórico
- toda pendência deve ter prioridade
- empresa sem acesso válido não pode aparecer como totalmente OK

## Critério de conclusão
A fase termina quando já for possível:

- visualizar a carteira de forma consolidada
- registrar uma varredura
- gerar pendência
- acompanhar status operacional por empresa
- trabalhar com fila básica de tratamento

---

# FASE 3 — INTEGRAÇÕES PRIORITÁRIAS

## Objetivo
Substituir parte relevante da conferência manual por leitura automatizada.

## Entregas
- camada de integração
- normalização de retornos
- leitura de dados prioritários
- persistência dos resultados consultados
- classificação automática de eventos
- tratamento de falha de integração

## Escopo funcional da fase
Esta fase deve focar apenas nas integrações que alimentam diretamente o núcleo operacional da V1.

## Módulos desta fase
### 1. IntegraçãoEmpresa
Controle de disponibilidade, status, erro e última execução.

### 2. Varredura automatizada real
Execução de consultas conforme a agenda definida.

### 3. Eventos automáticos
Criação automática de eventos a partir das respostas recebidas.

### 4. Pendências automáticas
Geração automática de fila de tratamento quando houver risco, erro ou necessidade de ação.

## Regras principais desta fase
- retorno externo nunca deve ser consumido diretamente na interface sem normalização
- falha de integração deve virar evento rastreável
- ausência de dado confiável não pode ser tratada como ausência de problema
- toda alteração relevante entre duas varreduras deve gerar evento

## Critério de conclusão
A fase termina quando o sistema já conseguir:

- executar consultas reais prioritárias
- persistir resultados
- apontar parcelamentos relevantes
- apontar sinais de dívida ativa
- gerar pendências automaticamente
- registrar falhas de integração

---

# FASE 4 — PAINEL DE PARCELAMENTOS

## Objetivo
Consolidar em uma única visão o acompanhamento dos parcelamentos por empresa.

## Entregas
- entidade de parcelamento
- tela consolidada de parcelamentos
- card/resumo por empresa
- histórico básico de mudança de situação
- vínculo com pendências operacionais

## Campos mínimos por parcelamento
- empresa
- modalidade
- situação
- quantidade de parcelas
- parcela atual
- data relevante
- indício de atraso
- necessidade de ação
- data da última atualização

## Critério de conclusão
A fase termina quando já for possível:

- identificar empresas com parcelamento
- identificar situação relevante do parcelamento
- localizar rapidamente o que exige ação
- navegar do parcelamento para a pendência correspondente

---

# FASE 5 — PAINEL DE DÍVIDA ATIVA

## Objetivo
Consolidar a visão operacional de dívida ativa por empresa.

## Entregas
- entidade de dívida ativa
- tela consolidada de dívida ativa
- resumo por empresa
- histórico básico de alteração
- vínculo com tratamento operacional

## Campos mínimos por dívida ativa
- empresa
- existência de inscrição
- quantidade de inscrições
- valor consolidado
- situação identificada
- data da última atualização
- necessidade de conferência
- necessidade de ação

## Critério de conclusão
A fase termina quando já for possível:

- localizar rapidamente empresas com indício de dívida ativa
- distinguir empresas sem ocorrência das que exigem análise
- transformar o achado em pendência operacional tratável

---

# FASE 6 — WORKSPACE DE APURAÇÃO MENSAL

## Objetivo
Organizar o fluxo mensal da apuração com base na situação operacional da empresa.

## Entregas
- entidade CompetenciaApuracao
- painel por competência
- estados operacionais da apuração
- checklist mínimo por empresa
- bloqueios operacionais
- histórico da competência

## Estados mínimos
- aguardando varredura
- pendente de análise
- bloqueada por pendência
- pronta para apuração
- em apuração
- aguardando validação
- concluída

## Regras principais desta fase
- empresa com pendência crítica não entra como pronta para apuração
- o sistema deve mostrar o motivo do bloqueio
- toda mudança de estado deve ficar registrada

## Critério de conclusão
A fase termina quando já for possível:

- abrir uma competência
- visualizar o status de apuração da carteira
- separar empresas prontas e bloqueadas
- registrar andamento da execução mensal

---

# FASE 7 — ALERTAS E REFINAMENTO OPERACIONAL

## Objetivo
Melhorar a resposta do time e fechar o ciclo de operação por exceção.

## Entregas
- alertas internos
- filtros avançados
- busca rápida
- ordenação por criticidade
- melhoria de usabilidade
- exportações simples
- melhorias de observabilidade
- refinamento de logs

## Alertas mínimos
- parcela vencendo
- parcelamento em atraso
- nova pendência crítica
- nova dívida ativa
- empresa bloqueada por acesso
- falha de integração
- empresa bloqueada para apuração

## Critério de conclusão
A fase termina quando o sistema já conseguir:

- avisar o time sobre mudanças relevantes
- reduzir ainda mais necessidade de conferência manual
- priorizar melhor a execução diária

---

# ORDEM EXATA DE DESENVOLVIMENTO

## Bloco 1
- estrutura do projeto
- autenticação interna
- banco de dados
- cadastro de empresas
- responsáveis internos

## Bloco 2
- dashboard principal
- varredura
- eventos
- pendências
- histórico de execução

## Bloco 3
- integrações prioritárias
- normalização
- eventos automáticos
- falhas de integração

## Bloco 4
- painel de parcelamentos
- painel de dívida ativa

## Bloco 5
- workspace de apuração mensal

## Bloco 6
- alertas
- filtros
- refinamentos operacionais

---

# O QUE NÃO PODE ACONTECER NA V1

Não desviar esforço para:

- ERP completo
- automações secundárias
- telas excessivas sem impacto operacional
- módulos financeiros
- recursos comerciais
- app mobile
- automações bonitas mas frágeis
- qualquer feature que não reduza esforço recorrente da carteira

---

# CRITÉRIOS DE PRIORIZAÇÃO

Toda tarefa do backlog deve ser avaliada por estas perguntas:

1. reduz trabalho manual recorrente?
2. melhora visibilidade operacional da carteira?
3. aumenta confiabilidade da rotina mensal?
4. melhora a priorização do time?
5. reduz risco de esquecimento ou atraso?

Se não atender pelo menos uma dessas condições com impacto real, a tarefa deve perder prioridade.

---

# MARCOS DE ENTREGA DA V1

## Marco 1
Base técnica pronta e cadastro operacional funcionando.

## Marco 2
Dashboard e pendências funcionando com fluxo interno controlado.

## Marco 3
Integrações prioritárias alimentando o sistema com dados reais.

## Marco 4
Parcelamentos e dívida ativa consolidados em painéis próprios.

## Marco 5
Apuração mensal organizada por status e bloqueios.

## Marco 6
Alertas e refinamentos fechando a operação por exceção.

---

# DEFINIÇÃO DE PRONTO DA V1

A V1 será considerada pronta quando:

- a carteira estiver centralizada
- a varredura estiver operacionalizada
- as pendências estiverem organizadas em fila
- parcelamentos estiverem visíveis em painel próprio
- dívida ativa estiver visível em painel próprio
- a apuração mensal estiver organizada por status
- o sistema já reduzir de forma perceptível o trabalho manual do escritório
- houver histórico mínimo confiável de execução e tratamento

---

# FECHAMENTO
Este roadmap existe para impedir expansão prematura de escopo e manter o projeto focado no que realmente gera ganho operacional.

A V1 do ECAC AUTOMAÇÃO deve ser simples, rastreável, confiável e útil no dia a dia.
\# TASKLIST-V1.md



\## Projeto

\*\*ECAC AUTOMAÇÃO\*\*



\## Objetivo da tasklist

Quebrar a V1 em tarefas objetivas de implementação, mantendo o desenvolvimento focado no núcleo operacional do sistema.



\## Regra geral

Toda tarefa deste arquivo deve contribuir diretamente para pelo menos um destes objetivos:



\- reduzir trabalho manual recorrente

\- melhorar visibilidade operacional da carteira

\- aumentar confiabilidade da rotina mensal

\- melhorar priorização do time

\- reduzir risco de esquecimento, atraso ou retrabalho



Se não atender isso, não deve entrar agora.



\---



\# FASE 0 — PREPARAÇÃO



\## 0.1 Documentação base

\- \[x] Criar `MVP-BASE.md`

\- \[x] Criar `README.md`

\- \[x] Criar `ROADMAP-V1.md`

\- \[ ] Criar `TASKLIST-V1.md`

\- \[ ] Criar `.env.example`

\- \[ ] Criar convenção de nomes de branches

\- \[ ] Criar convenção de commits

\- \[ ] Criar padrão de organização de pastas



\## 0.2 Repositório e segurança

\- \[ ] Criar repositório do projeto

\- \[ ] Configurar `.gitignore`

\- \[ ] Validar que segredos não serão versionados

\- \[ ] Definir variáveis sensíveis do ambiente

\- \[ ] Separar ambiente local, teste e produção

\- \[ ] Validar rotina inicial de backup do projeto



\## 0.3 Decisões técnicas iniciais

\- \[ ] Definir stack do frontend

\- \[ ] Definir stack do backend

\- \[ ] Definir ORM

\- \[ ] Definir banco de dados

\- \[ ] Definir fila/jobs

\- \[ ] Definir estratégia de autenticação interna

\- \[ ] Definir estratégia de logs

\- \[ ] Definir estratégia de armazenamento de evidências



\---



\# FASE 1 — BASE ESTRUTURAL



\## 1.1 Inicialização do projeto

\- \[ ] Criar estrutura inicial do frontend

\- \[ ] Criar estrutura inicial do backend

\- \[ ] Criar estrutura compartilhada de tipos, se necessário

\- \[ ] Configurar lint

\- \[ ] Configurar formatter

\- \[ ] Configurar aliases de importação

\- \[ ] Configurar scripts base do projeto



\## 1.2 Banco de dados

\- \[ ] Criar conexão com banco

\- \[ ] Configurar migrations

\- \[ ] Criar seed inicial, se necessário

\- \[ ] Validar ambiente local com banco funcional



\## 1.3 Modelagem inicial

\- \[ ] Criar entidade `UsuarioInterno`

\- \[ ] Criar entidade `ResponsavelInterno`

\- \[ ] Criar entidade `Empresa`

\- \[ ] Criar entidade `IntegracaoEmpresa`



\## 1.4 Campos mínimos de `Empresa`

\- \[ ] id

\- \[ ] cnpj

\- \[ ] razaoSocial

\- \[ ] nomeFantasia

\- \[ ] regimeTributario

\- \[ ] responsavelInternoId

\- \[ ] statusAcesso

\- \[ ] statusProcuracao

\- \[ ] observacoesOperacionais

\- \[ ] ultimaVarreduraEm

\- \[ ] ultimoEventoRelevanteEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 1.5 Campos mínimos de `UsuarioInterno`

\- \[ ] id

\- \[ ] nome

\- \[ ] email

\- \[ ] senhaHash

\- \[ ] perfil

\- \[ ] ativo

\- \[ ] createdAt

\- \[ ] updatedAt



\## 1.6 Campos mínimos de `ResponsavelInterno`

\- \[ ] id

\- \[ ] nome

\- \[ ] email

\- \[ ] usuarioInternoId

\- \[ ] ativo

\- \[ ] createdAt

\- \[ ] updatedAt



\## 1.7 Campos mínimos de `IntegracaoEmpresa`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] tipoIntegracao

\- \[ ] statusIntegracao

\- \[ ] ultimoSucessoEm

\- \[ ] ultimoErroEm

\- \[ ] mensagemErroAtual

\- \[ ] observacoes

\- \[ ] createdAt

\- \[ ] updatedAt



\## 1.8 Autenticação interna

\- \[ ] Criar rota de login

\- \[ ] Criar rota de sessão atual

\- \[ ] Criar proteção de rotas privadas

\- \[ ] Criar logout

\- \[ ] Definir papéis mínimos de usuário

\- \[ ] Validar fluxo básico de autenticação



\## 1.9 CRUD operacional básico

\- \[ ] Criar tela de login

\- \[ ] Criar tela de dashboard vazio inicial

\- \[ ] Criar tela de listagem de empresas

\- \[ ] Criar tela de cadastro de empresa

\- \[ ] Criar tela de detalhe da empresa

\- \[ ] Criar tela de usuários internos

\- \[ ] Criar tela de responsáveis internos



\## 1.10 Regras mínimas da base

\- \[ ] Impedir cadastro duplicado de CNPJ

\- \[ ] Validar formato do CNPJ

\- \[ ] Permitir associar empresa a responsável interno

\- \[ ] Exibir status de acesso e procuração na empresa

\- \[ ] Registrar timestamps corretamente



\---



\# FASE 2 — NÚCLEO OPERACIONAL



\## 2.1 Modelagem operacional

\- \[ ] Criar entidade `Varredura`

\- \[ ] Criar entidade `EventoOperacional`

\- \[ ] Criar entidade `Pendencia`

\- \[ ] Criar entidade `LogExecucao`



\## 2.2 Campos mínimos de `Varredura`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] tipoVarredura

\- \[ ] origem

\- \[ ] statusExecucao

\- \[ ] iniciadoEm

\- \[ ] finalizadoEm

\- \[ ] resumoResultado

\- \[ ] createdAt

\- \[ ] updatedAt



\## 2.3 Campos mínimos de `EventoOperacional`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] varreduraId

\- \[ ] tipoEvento

\- \[ ] criticidade

\- \[ ] descricao

\- \[ ] status

\- \[ ] detectadoEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 2.4 Campos mínimos de `Pendencia`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] eventoOperacionalId

\- \[ ] tipoPendencia

\- \[ ] origem

\- \[ ] prioridade

\- \[ ] descricao

\- \[ ] responsavelInternoId

\- \[ ] prazo

\- \[ ] status

\- \[ ] resolvidoEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 2.5 Campos mínimos de `LogExecucao`

\- \[ ] id

\- \[ ] contexto

\- \[ ] referenciaId

\- \[ ] nivel

\- \[ ] mensagem

\- \[ ] payloadResumo

\- \[ ] criadoEm



\## 2.6 Dashboard principal

\- \[ ] Criar cards de indicadores principais

\- \[ ] Exibir total de empresas

\- \[ ] Exibir empresas OK

\- \[ ] Exibir empresas com pendência

\- \[ ] Exibir empresas com parcelamento

\- \[ ] Exibir empresas com dívida ativa

\- \[ ] Exibir empresas bloqueadas por acesso

\- \[ ] Exibir empresas com falha de integração

\- \[ ] Exibir empresas prontas para apuração

\- \[ ] Exibir empresas bloqueadas para apuração



\## 2.7 Motor de varredura inicial

\- \[ ] Criar serviço de varredura manual por empresa

\- \[ ] Criar serviço de varredura em lote

\- \[ ] Registrar início e fim da varredura

\- \[ ] Registrar resultado resumido

\- \[ ] Criar base para agendamento futuro

\- \[ ] Garantir idempotência mínima onde possível



\## 2.8 Regras iniciais de eventos

\- \[ ] Criar regra para empresa sem acesso válido

\- \[ ] Criar regra para falha de integração

\- \[ ] Criar regra para pendência detectada manualmente

\- \[ ] Criar regra para mudança de status operacional

\- \[ ] Criar classificação inicial de criticidade



\## 2.9 Painel de pendências

\- \[ ] Criar listagem de pendências

\- \[ ] Filtrar por prioridade

\- \[ ] Filtrar por responsável

\- \[ ] Filtrar por status

\- \[ ] Filtrar por tipo

\- \[ ] Abrir detalhe da pendência

\- \[ ] Permitir alterar status da pendência

\- \[ ] Permitir reatribuir pendência

\- \[ ] Permitir registrar observação



\## 2.10 Histórico operacional

\- \[ ] Criar tela de histórico por empresa

\- \[ ] Exibir últimas varreduras

\- \[ ] Exibir últimos eventos

\- \[ ] Exibir últimas pendências

\- \[ ] Exibir erros de integração

\- \[ ] Exibir logs relevantes



\---



\# FASE 3 — INTEGRAÇÕES PRIORITÁRIAS



\## 3.1 Camada de integração

\- \[ ] Criar módulo de integrações

\- \[ ] Padronizar contrato de integração

\- \[ ] Separar adaptadores por origem

\- \[ ] Criar tratamento de timeout

\- \[ ] Criar tratamento de erro

\- \[ ] Criar normalização de retorno

\- \[ ] Criar logs por execução externa



\## 3.2 Controle operacional de integração por empresa

\- \[ ] Exibir status da integração por empresa

\- \[ ] Exibir último sucesso

\- \[ ] Exibir último erro

\- \[ ] Exibir mensagem resumida de falha

\- \[ ] Permitir reprocessar integração manualmente



\## 3.3 Jobs e agenda

\- \[ ] Configurar fila de jobs

\- \[ ] Criar job de varredura diária leve

\- \[ ] Criar job de varredura semanal completa

\- \[ ] Criar job de varredura mensal de fechamento

\- \[ ] Registrar logs de jobs

\- \[ ] Criar proteção contra execução duplicada indevida



\## 3.4 Integração de parcelamentos

\- \[ ] Criar serviço de leitura de parcelamentos

\- \[ ] Mapear retorno para estrutura interna

\- \[ ] Persistir dados relevantes

\- \[ ] Detectar alterações entre execuções

\- \[ ] Gerar evento operacional de parcelamento

\- \[ ] Gerar pendência automática quando necessário



\## 3.5 Integração de dívida ativa

\- \[ ] Criar serviço de leitura de dívida ativa

\- \[ ] Mapear retorno para estrutura interna

\- \[ ] Persistir dados relevantes

\- \[ ] Detectar alterações entre execuções

\- \[ ] Gerar evento operacional de dívida ativa

\- \[ ] Gerar pendência automática quando necessário



\## 3.6 Regras de confiabilidade

\- \[ ] Não tratar falha de consulta como ausência de problema

\- \[ ] Não sobrescrever dado válido com retorno inconclusivo

\- \[ ] Registrar tentativa e erro de integração

\- \[ ] Criar fallback de status “necessita conferência”



\---



\# FASE 4 — PAINEL DE PARCELAMENTOS



\## 4.1 Modelagem

\- \[ ] Criar entidade `Parcelamento`



\## 4.2 Campos mínimos de `Parcelamento`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] modalidade

\- \[ ] situacao

\- \[ ] quantidadeParcelas

\- \[ ] parcelaAtual

\- \[ ] dataVencimentoRelevante

\- \[ ] indicioAtraso

\- \[ ] requerAcao

\- \[ ] ultimaAtualizacaoEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 4.3 Interface

\- \[ ] Criar tela consolidada de parcelamentos

\- \[ ] Criar filtros por situação

\- \[ ] Criar filtros por responsável

\- \[ ] Criar filtros por requer ação

\- \[ ] Criar navegação do parcelamento para empresa

\- \[ ] Criar navegação do parcelamento para pendência relacionada



\## 4.4 Regras

\- \[ ] Detectar parcelamento com risco operacional

\- \[ ] Detectar parcela vencendo

\- \[ ] Detectar atraso

\- \[ ] Gerar status visual claro

\- \[ ] Priorizar parcelamentos com ação pendente



\---



\# FASE 5 — PAINEL DE DÍVIDA ATIVA



\## 5.1 Modelagem

\- \[ ] Criar entidade `DividaAtiva`



\## 5.2 Campos mínimos de `DividaAtiva`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] possuiInscricao

\- \[ ] quantidadeInscricoes

\- \[ ] valorConsolidado

\- \[ ] situacaoIdentificada

\- \[ ] requerConferencia

\- \[ ] requerAcao

\- \[ ] ultimaAtualizacaoEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 5.3 Interface

\- \[ ] Criar tela consolidada de dívida ativa

\- \[ ] Criar filtros por ocorrência

\- \[ ] Criar filtros por requer ação

\- \[ ] Criar filtros por responsável

\- \[ ] Criar navegação da dívida ativa para empresa

\- \[ ] Criar navegação da dívida ativa para pendência relacionada



\## 5.4 Regras

\- \[ ] Criar classificação visual de ocorrência

\- \[ ] Diferenciar “sem ocorrência” de “não foi possível confirmar”

\- \[ ] Gerar evento quando houver mudança relevante

\- \[ ] Gerar pendência quando exigir tratamento humano



\---



\# FASE 6 — WORKSPACE DE APURAÇÃO MENSAL



\## 6.1 Modelagem

\- \[ ] Criar entidade `CompetenciaApuracao`

\- \[ ] Criar entidade `TarefaOperacional`



\## 6.2 Campos mínimos de `CompetenciaApuracao`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] competencia

\- \[ ] status

\- \[ ] bloqueadaPorPendencia

\- \[ ] observacoes

\- \[ ] iniciadaEm

\- \[ ] concluidaEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 6.3 Campos mínimos de `TarefaOperacional`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] competenciaApuracaoId

\- \[ ] titulo

\- \[ ] descricao

\- \[ ] prioridade

\- \[ ] responsavelInternoId

\- \[ ] status

\- \[ ] prazo

\- \[ ] concluidaEm

\- \[ ] createdAt

\- \[ ] updatedAt



\## 6.4 Interface

\- \[ ] Criar painel por competência

\- \[ ] Exibir empresas aguardando varredura

\- \[ ] Exibir empresas pendentes de análise

\- \[ ] Exibir empresas bloqueadas por pendência

\- \[ ] Exibir empresas prontas para apuração

\- \[ ] Exibir empresas em apuração

\- \[ ] Exibir empresas aguardando validação

\- \[ ] Exibir empresas concluídas



\## 6.5 Regras

\- \[ ] Impedir que empresa com pendência crítica apareça como pronta

\- \[ ] Exibir motivo do bloqueio

\- \[ ] Permitir mudança controlada de status

\- \[ ] Registrar histórico de transição

\- \[ ] Vincular tarefas operacionais à competência



\---



\# FASE 7 — AUDITORIA, EVIDÊNCIAS E ALERTAS



\## 7.1 Modelagem

\- \[ ] Criar entidade `Evidencia`



\## 7.2 Campos mínimos de `Evidencia`

\- \[ ] id

\- \[ ] empresaId

\- \[ ] pendenciaId

\- \[ ] tarefaOperacionalId

\- \[ ] tipo

\- \[ ] nomeArquivo

\- \[ ] urlOuCaminho

\- \[ ] descricao

\- \[ ] anexadaPorUsuarioId

\- \[ ] createdAt



\## 7.3 Auditoria

\- \[ ] Registrar ação manual relevante

\- \[ ] Registrar alteração de status

\- \[ ] Registrar reprocessamento de integração

\- \[ ] Registrar anexos/evidências

\- \[ ] Criar histórico rastreável por empresa



\## 7.4 Alertas internos

\- \[ ] Criar alerta para parcela vencendo

\- \[ ] Criar alerta para parcelamento em atraso

\- \[ ] Criar alerta para nova pendência crítica

\- \[ ] Criar alerta para nova dívida ativa

\- \[ ] Criar alerta para falha de integração

\- \[ ] Criar alerta para empresa bloqueada para apuração



\## 7.5 Interface e usabilidade

\- \[ ] Criar filtro global por responsável

\- \[ ] Criar filtro global por criticidade

\- \[ ] Criar busca por CNPJ

\- \[ ] Criar busca por razão social

\- \[ ] Criar ordenação por prioridade

\- \[ ] Criar visão rápida de empresa crítica



\---



\# TESTES MÍNIMOS DA V1



\## Backend

\- \[ ] Testar autenticação

\- \[ ] Testar criação de empresa

\- \[ ] Testar prevenção de CNPJ duplicado

\- \[ ] Testar criação de varredura

\- \[ ] Testar geração de evento operacional

\- \[ ] Testar geração de pendência

\- \[ ] Testar persistência de parcelamento

\- \[ ] Testar persistência de dívida ativa

\- \[ ] Testar bloqueio de apuração por pendência crítica



\## Frontend

\- \[ ] Testar login

\- \[ ] Testar listagem de empresas

\- \[ ] Testar cadastro de empresa

\- \[ ] Testar dashboard

\- \[ ] Testar painel de pendências

\- \[ ] Testar painel de parcelamentos

\- \[ ] Testar painel de dívida ativa

\- \[ ] Testar workspace de apuração



\## Integrações

\- \[ ] Testar tratamento de falha externa

\- \[ ] Testar timeout

\- \[ ] Testar retorno parcial

\- \[ ] Testar retorno inconsistente

\- \[ ] Testar reprocessamento manual

\- \[ ] Testar geração de logs



\---



\# CHECKLIST DE PRONTO PARA PRIMEIRO USO INTERNO



\- \[ ] Usuário interno consegue entrar no sistema

\- \[ ] Empresa consegue ser cadastrada corretamente

\- \[ ] Responsável interno consegue ser associado

\- \[ ] Status operacional da empresa fica visível

\- \[ ] Dashboard principal mostra a carteira

\- \[ ] Pendências aparecem em fila tratável

\- \[ ] Parcelamentos aparecem em painel próprio

\- \[ ] Dívida ativa aparece em painel próprio

\- \[ ] Competência mensal pode ser acompanhada

\- \[ ] Histórico mínimo fica registrado

\- \[ ] Alertas críticos ficam visíveis

\- \[ ] Sistema possui logs mínimos de execução



\---



\# ITENS QUE NÃO DEVEM ENTRAR AGORA



\- \[ ] ERP completo

\- \[ ] Módulo financeiro do escritório

\- \[ ] CRM

\- \[ ] App mobile

\- \[ ] BI avançado

\- \[ ] Automações paralelas sem impacto na rotina principal

\- \[ ] Features cosméticas sem ganho operacional real



\---



\# ORDEM REAL DE EXECUÇÃO



\## Bloco 1 — começar aqui

\- \[ ] criar repositório

\- \[ ] configurar ambiente

\- \[ ] configurar banco

\- \[ ] modelar usuário, responsável, empresa e integração

\- \[ ] criar autenticação

\- \[ ] criar CRUD de empresas



\## Bloco 2

\- \[ ] criar dashboard inicial

\- \[ ] criar varredura

\- \[ ] criar eventos

\- \[ ] criar pendências

\- \[ ] criar histórico operacional



\## Bloco 3

\- \[ ] implementar camada de integração

\- \[ ] implementar leitura de parcelamentos

\- \[ ] implementar leitura de dívida ativa

\- \[ ] gerar pendências automáticas

\- \[ ] registrar falhas de integração



\## Bloco 4

\- \[ ] criar painel de parcelamentos

\- \[ ] criar painel de dívida ativa



\## Bloco 5

\- \[ ] criar workspace de apuração mensal

\- \[ ] criar tarefas operacionais

\- \[ ] criar bloqueios por pendência



\## Bloco 6

\- \[ ] criar evidências

\- \[ ] criar alertas

\- \[ ] refinar filtros, busca e usabilidade



\---



\# OBSERVAÇÃO FINAL

Esta tasklist existe para impedir dispersão.



A prioridade do ECAC AUTOMAÇÃO não é parecer grande.

A prioridade é funcionar bem no escritório, reduzir trabalho manual e sustentar uma operação confiável sobre a carteira.


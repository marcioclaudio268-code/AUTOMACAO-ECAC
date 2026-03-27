import 'reflect-metadata';

import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as os from 'node:os';
import * as net from 'node:net';

import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import {
  PerfilUsuario,
  PrismaClient,
  RegimeTributario
} from '@prisma/client';
import EmbeddedPostgres from 'embedded-postgres';
import * as bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const TEST_TIMEOUT = 120_000;
const ADMIN_EMAIL = 'admin@ecac.local';
const ADMIN_PASSWORD = 'admin123';
const COMPANY_CNPJ_WITHOUT_RESP = '11111111000191';
const COMPANY_CNPJ_WITH_RESP = '22222222000172';
const COMPANY_CNPJ_PRESERVE_RESP = '33333333000163';
const RESPONSAVEL_CRUD_EMAIL = 'responsavel.crud@ecac.local';
const RESPONSAVEL_CRUD_UPDATED_EMAIL = 'responsavel.crud.editado@ecac.local';
const RESPONSAVEL_PRINCIPAL_EMAIL = 'responsavel.principal@ecac.local';
const RESPONSAVEL_SECUNDARIO_EMAIL = 'responsavel.secundario@ecac.local';
const TEST_DATABASE_NAME = 'ecac_automacao_integration';
const INTEGRATION_JWT_SECRET = 'integration-test-secret';
const API_ROOT = process.cwd();
const requireFromApi = createRequire(path.join(API_ROOT, 'package.json'));

process.env.JWT_SECRET = INTEGRATION_JWT_SECRET;

type JsonRecord = Record<string, unknown>;

type RequestOptions = {
  body?: unknown;
  cookie?: string;
  method?: 'GET' | 'POST' | 'PATCH';
};

let postgres: EmbeddedPostgres;
let prisma: PrismaClient;
let app: INestApplication | undefined;
let baseUrl = '';
let sessionCookie = '';
let adminUserId = '';
let secondaryUserId = '';
let responsavelPrincipalId = '';
let responsavelSecundarioId = '';
let tempRoot = '';
let postgresPort = 0;

beforeAll(async () => {
  tempRoot = await mkdtemp(path.join(os.tmpdir(), 'ecac-automacao-it-'));
  const databaseDir = path.join(tempRoot, 'postgres');
  postgresPort = await getFreePort();

  postgres = new EmbeddedPostgres({
    databaseDir,
    password: 'password',
    persistent: true,
    port: postgresPort,
    user: 'postgres'
  });

  await postgres.initialise();
  await postgres.start();
  await postgres.createDatabase(TEST_DATABASE_NAME);

  process.env.DATABASE_URL = `postgresql://postgres:password@127.0.0.1:${postgresPort}/${TEST_DATABASE_NAME}?schema=public`;
  process.env.JWT_SECRET = INTEGRATION_JWT_SECRET;

  runPrismaMigrateDeploy();
  runBackendBuild();

  const [authModule, companiesModule, responsaveisModule] = (await Promise.all([
    importModuleFromDist('modules/auth/auth.module.js'),
    importModuleFromDist('modules/companies/companies.module.js'),
    importModuleFromDist('modules/responsaveis/responsaveis.module.js')
  ])) as [AnyModuleNamespace, AnyModuleNamespace, AnyModuleNamespace];

  const IntegrationTestModule = class IntegrationTestModule {};
  Module({
    imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: true,
        isGlobal: true
      }),
      authModule.AuthModule,
      companiesModule.CompaniesModule,
      responsaveisModule.ResponsaveisModule
    ]
  })(IntegrationTestModule);

  prisma = new PrismaClient();
  await seedUsers();

  app = await NestFactory.create(IntegrationTestModule, {
    logger: ['error']
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();

  sessionCookie = await loginAndGetCookie();
  responsavelPrincipalId = await createResponsavelViaApi({
    email: RESPONSAVEL_PRINCIPAL_EMAIL,
    nome: 'Responsavel Principal',
    usuarioInternoId: adminUserId
  });
  responsavelSecundarioId = await createResponsavelViaApi({
    email: RESPONSAVEL_SECUNDARIO_EMAIL,
    nome: 'Responsavel Secundario',
    usuarioInternoId: secondaryUserId
  });
}, TEST_TIMEOUT);

afterAll(async () => {
  if (app) {
    await app.close();
  }

  if (prisma) {
    await prisma.$disconnect();
  }

  if (postgres) {
    await postgres.stop();
  }

  if (tempRoot) {
    await removeDirectoryWithRetry(tempRoot);
  }
}, TEST_TIMEOUT);

describe('homologacao local do bloco companies e responsaveis', () => {
  test('protege rotas e permite acesso autenticado com sessao valida', async () => {
    const login = await requestJson('/auth/login', {
      body: {
        email: ADMIN_EMAIL,
        senha: ADMIN_PASSWORD
      },
      method: 'POST'
    });

    expect(login.response.status).toBe(200);
    expect(login.body).toMatchObject({
      user: {
        email: ADMIN_EMAIL
      }
    });

    const loginSetCookie = login.response.headers.get('set-cookie');
    expect(loginSetCookie).not.toBeNull();
    const loginCookie = extractCookie(loginSetCookie as string);
    expect(loginCookie).toContain('=');

    const authMe = await requestJson('/auth/me', {
      cookie: loginCookie
    });

    expect(authMe.response.status).toBe(200);
    expect(authMe.body).toMatchObject({
      email: ADMIN_EMAIL
    });

    const companiesWithoutAuth = await requestJson('/companies');
    expect(companiesWithoutAuth.response.status).toBe(401);

    const responsaveisWithoutAuth = await requestJson('/responsaveis');
    expect(responsaveisWithoutAuth.response.status).toBe(401);

    const companiesWithAuth = await requestJson('/companies', {
      cookie: loginCookie
    });
    expect(companiesWithAuth.response.status).toBe(200);
    expect(Array.isArray(companiesWithAuth.body)).toBe(true);

    const responsaveisWithAuth = await requestJson('/responsaveis', {
      cookie: loginCookie
    });
    expect(responsaveisWithAuth.response.status).toBe(200);
    expect(Array.isArray(responsaveisWithAuth.body)).toBe(true);
    expect(
      (responsaveisWithAuth.body as Array<{ id: string }>).some(
        (item) => item.id === responsavelPrincipalId
      )
    ).toBe(true);
  }, TEST_TIMEOUT);

  test('responsaveis cria, consulta por id e edita com persistencia real', async () => {
    const created = await createResponsavelViaApi({
      email: RESPONSAVEL_CRUD_EMAIL,
      nome: 'Responsavel CRUD',
      usuarioInternoId: adminUserId
    });

    const createdPersisted = await prisma.responsavelInterno.findUniqueOrThrow({
      where: {
        id: created
      }
    });

    expect(createdPersisted.email).toBe(RESPONSAVEL_CRUD_EMAIL);
    expect(createdPersisted.nome).toBe('Responsavel CRUD');
    expect(createdPersisted.usuarioInternoId).toBe(adminUserId);

    const fetched = await requestJson(`/responsaveis/${created}`, {
      cookie: sessionCookie
    });
    expect(fetched.response.status).toBe(200);
    expect(fetched.body).toMatchObject({
      email: RESPONSAVEL_CRUD_EMAIL,
      id: created
    });

    const updated = await requestJson(`/responsaveis/${created}`, {
      body: {
        email: RESPONSAVEL_CRUD_UPDATED_EMAIL,
        nome: 'Responsavel CRUD Editado'
      },
      cookie: sessionCookie,
      method: 'PATCH'
    });
    expect(updated.response.status).toBe(200);
    expect(updated.body).toMatchObject({
      email: RESPONSAVEL_CRUD_UPDATED_EMAIL,
      nome: 'Responsavel CRUD Editado'
    });

    const updatedPersisted = await prisma.responsavelInterno.findUniqueOrThrow({
      where: {
        id: created
      }
    });
    expect(updatedPersisted.email).toBe(RESPONSAVEL_CRUD_UPDATED_EMAIL);
    expect(updatedPersisted.nome).toBe('Responsavel CRUD Editado');
  }, TEST_TIMEOUT);

  test('companies conecta, desconecta e preserva o responsavel corretamente', async () => {
    const empresaSemResponsavel = await createCompanyViaApi({
      cnpj: COMPANY_CNPJ_WITHOUT_RESP,
      razaoSocial: 'Empresa Sem Responsavel Ltda',
      regimeTributario: RegimeTributario.SIMPLES_NACIONAL
    });

    const empresaSemResponsavelPersistida =
      await prisma.empresa.findUniqueOrThrow({
        where: {
          id: empresaSemResponsavel
        }
      });

    expect(empresaSemResponsavelPersistida.responsavelInternoId).toBeNull();

    const empresaComResponsavel = await createCompanyViaApi({
      cnpj: COMPANY_CNPJ_WITH_RESP,
      razaoSocial: 'Empresa Fluxo Ltda',
      regimeTributario: RegimeTributario.LUCRO_PRESUMIDO,
      responsavelInternoId: responsavelPrincipalId
    });

    const empresaComResponsavelPersistida =
      await prisma.empresa.findUniqueOrThrow({
        where: {
          id: empresaComResponsavel
        }
      });

    expect(empresaComResponsavelPersistida.responsavelInternoId).toBe(
      responsavelPrincipalId
    );

    const keepResponsavel = await updateCompanyViaApi(empresaComResponsavel, {
      razaoSocial: 'Empresa Fluxo Ltda Atualizada',
      responsavelInternoId: responsavelPrincipalId
    });
    expect(keepResponsavel.response.status).toBe(200);

    const keepResponsavelPersistida = await prisma.empresa.findUniqueOrThrow({
      where: {
        id: empresaComResponsavel
      }
    });
    expect(keepResponsavelPersistida.razaoSocial).toBe(
      'Empresa Fluxo Ltda Atualizada'
    );
    expect(keepResponsavelPersistida.responsavelInternoId).toBe(
      responsavelPrincipalId
    );

    const trocaResponsavel = await updateCompanyViaApi(empresaComResponsavel, {
      responsavelInternoId: responsavelSecundarioId
    });
    expect(trocaResponsavel.response.status).toBe(200);

    const trocaResponsavelPersistida = await prisma.empresa.findUniqueOrThrow({
      where: {
        id: empresaComResponsavel
      }
    });
    expect(trocaResponsavelPersistida.responsavelInternoId).toBe(
      responsavelSecundarioId
    );

    const removeResponsavelNull = await updateCompanyViaApi(
      empresaComResponsavel,
      {
        responsavelInternoId: null
      }
    );
    expect(removeResponsavelNull.response.status).toBe(200);

    const removidoNullPersistido = await prisma.empresa.findUniqueOrThrow({
      where: {
        id: empresaComResponsavel
      }
    });
    expect(removidoNullPersistido.responsavelInternoId).toBeNull();

    await updateCompanyViaApi(empresaComResponsavel, {
      responsavelInternoId: responsavelPrincipalId
    });

    const removeResponsavelVazio = await updateCompanyViaApi(
      empresaComResponsavel,
      {
        responsavelInternoId: ''
      }
    );
    expect(removeResponsavelVazio.response.status).toBe(200);

    const removidoVazioPersistido = await prisma.empresa.findUniqueOrThrow({
      where: {
        id: empresaComResponsavel
      }
    });
    expect(removidoVazioPersistido.responsavelInternoId).toBeNull();

    const empresaPreservaResponsavel = await createCompanyViaApi({
      cnpj: COMPANY_CNPJ_PRESERVE_RESP,
      razaoSocial: 'Empresa Preserva Responsavel Ltda',
      regimeTributario: RegimeTributario.OUTRO,
      responsavelInternoId: responsavelPrincipalId
    });

    const preservaSemCampo = await updateCompanyViaApi(
      empresaPreservaResponsavel,
      {
        razaoSocial: 'Empresa Preserva Responsavel Ltda 2'
      }
    );
    expect(preservaSemCampo.response.status).toBe(200);

    const preservadoPersistido = await prisma.empresa.findUniqueOrThrow({
      where: {
        id: empresaPreservaResponsavel
      }
    });
    expect(preservadoPersistido.razaoSocial).toBe(
      'Empresa Preserva Responsavel Ltda 2'
    );
    expect(preservadoPersistido.responsavelInternoId).toBe(
      responsavelPrincipalId
    );
  }, TEST_TIMEOUT);
});

async function seedUsers(): Promise<void> {
  const adminSenhaHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const secondarySenhaHash = await bcrypt.hash('secondary123', 10);

  const admin = await prisma.usuarioInterno.create({
    data: {
      ativo: true,
      email: ADMIN_EMAIL,
      nome: 'Admin ECAC',
      perfil: PerfilUsuario.ADMIN,
      senhaHash: adminSenhaHash
    }
  });

  const secondary = await prisma.usuarioInterno.create({
    data: {
      ativo: true,
      email: `operacional-${randomUUID()}@ecac.local`,
      nome: 'Operacional ECAC',
      perfil: PerfilUsuario.OPERACIONAL,
      senhaHash: secondarySenhaHash
    }
  });

  adminUserId = admin.id;
  secondaryUserId = secondary.id;
}

async function loginAndGetCookie(): Promise<string> {
  const response = await requestJson('/auth/login', {
    body: {
      email: ADMIN_EMAIL,
      senha: ADMIN_PASSWORD
    },
    method: 'POST'
  });

  if (response.response.status !== 200) {
    throw new Error(
      `Login de teste falhou com status ${response.response.status}: ${JSON.stringify(response.body)}`
    );
  }

  const setCookie = response.response.headers.get('set-cookie');
  if (!setCookie) {
    throw new Error('Auth login nao retornou cookie de sessao.');
  }

  return extractCookie(setCookie);
}

async function createResponsavelViaApi(payload: JsonRecord): Promise<string> {
  const response = await requestJson('/responsaveis', {
    body: payload,
    cookie: sessionCookie,
    method: 'POST'
  });

  expect(response.response.status).toBe(201);
  const id = String((response.body as { id?: string }).id ?? '');

  if (!id) {
    throw new Error('Resposta de create responsavel sem id.');
  }

  return id;
}

async function createCompanyViaApi(payload: JsonRecord): Promise<string> {
  const response = await requestJson('/companies', {
    body: payload,
    cookie: sessionCookie,
    method: 'POST'
  });

  expect(response.response.status).toBe(201);
  const id = String((response.body as { id?: string }).id ?? '');

  if (!id) {
    throw new Error('Resposta de create company sem id.');
  }

  return id;
}

async function updateCompanyViaApi(id: string, payload: JsonRecord) {
  return requestJson(`/companies/${id}`, {
    body: payload,
    cookie: sessionCookie,
    method: 'PATCH'
  });
}

async function requestJson(pathname: string, options: RequestOptions = {}) {
  const headers: Record<string, string> = {
    accept: 'application/json'
  };

  if (options.cookie) {
    headers.cookie = options.cookie;
  }

  if (options.body !== undefined) {
    headers['content-type'] = 'application/json';
  }

  const response = await fetch(new URL(pathname, baseUrl), {
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
    headers,
    method: options.method ?? 'GET'
  });

  const text = await response.text();
  const body = text ? parseJson(text, pathname) : null;

  return {
    body,
    response,
    text
  };
}

function parseJson(text: string, pathname: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new Error(
      `Nao foi possivel decodificar JSON em ${pathname}: ${text}. Erro original: ${String(error)}`
    );
  }
}

function extractCookie(setCookieHeader: string): string {
  return setCookieHeader.split(';', 1)[0] ?? setCookieHeader;
}

function runPrismaMigrateDeploy(): void {
  const env = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL
  };

  const prismaCli = path.join(API_ROOT, 'node_modules', 'prisma', 'build', 'index.js');
  const result = spawnSync(process.execPath, [
    prismaCli,
    'migrate',
    'deploy',
    '--schema',
    'src/prisma/schema.prisma'
  ], {
    cwd: API_ROOT,
    encoding: 'utf8',
    env
  });

  if (result.error || result.status !== 0) {
    throw new Error(
      [
        'Falha ao executar prisma migrate deploy.',
        `status: ${String(result.status)}`,
        `stdout: ${result.stdout ?? ''}`,
        `stderr: ${result.stderr ?? ''}`,
        result.error ? `error: ${String(result.error)}` : ''
      ]
        .filter(Boolean)
        .join('\n')
    );
  }
}

function runBackendBuild(): void {
  rmSync(path.join(API_ROOT, 'tsconfig.build.tsbuildinfo'), {
    force: true
  });

  const tscCli = path.join(API_ROOT, 'node_modules', 'typescript', 'lib', 'tsc.js');
  const result = spawnSync(process.execPath, [tscCli, '-p', 'tsconfig.build.json'], {
    cwd: API_ROOT,
    encoding: 'utf8',
    env: process.env
  });

  if (result.error || result.status !== 0) {
    throw new Error(
      [
        'Falha ao executar tsc build.',
        `status: ${String(result.status)}`,
        `stdout: ${result.stdout ?? ''}`,
        `stderr: ${result.stderr ?? ''}`,
        result.error ? `error: ${String(result.error)}` : ''
      ]
        .filter(Boolean)
        .join('\n')
    );
  }
}

type AnyModuleNamespace = Record<string, any>;

async function importModuleFromDist(relativePath: string): Promise<AnyModuleNamespace> {
  const modulePath = path.join(API_ROOT, 'dist', relativePath);
  return requireFromApi(modulePath) as AnyModuleNamespace;
}

async function getFreePort(): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Nao foi possivel obter uma porta livre.'));
        return;
      }

      const port = address.port;

      server.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }

        resolve(port);
      });
    });
  });
}

async function removeDirectoryWithRetry(target: string): Promise<void> {
  const attempts = 10;

  for (let index = 0; index < attempts; index += 1) {
    try {
      await rm(target, { force: true, recursive: true });
      return;
    } catch (error) {
      if (index === attempts - 1 || !isRetryableRemoveError(error)) {
        throw error;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }
}

function isRetryableRemoveError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  return code === 'EBUSY' || code === 'EPERM' || code === 'ENOTEMPTY';
}

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

const source = readFileSync(new URL('../scripts/create-cms-admin.mjs', import.meta.url), 'utf8');
const testPassword = 'offline-fixture-only-password';

async function run(options = {}) {
  const output = [];
  const calls = [];
  let result;
  const db = {
    connect: async () => {
      assert.equal(db.disableCreateDatabase, true);
      assert.equal(db.push, false);
      assert.equal(db.prodMigrations, undefined);
      calls.push('connect');
    },
  };
  const fakePayload = {
    db,
    find: async (args) => {
      assert.equal(args.collection, 'users');
      assert.equal(args.where.email.equals, options.email || 'admin@example.com');
      calls.push('find');
      return { docs: options.exists ? [{ id: 2 }] : [] };
    },
    create: async (args) => {
      calls.push('create');
      if (options.createFails) throw new Error(`secret ${testPassword}`);
      assert.equal(args.data.password, testPassword);
      assert.equal(args.data.role, options.role || 'admin');
      return { id: 2, ...args.data, salt: 'hidden-salt', hash: 'hidden-hash' };
    },
    destroy: async () => {
      calls.push('destroy');
      if (options.destroyFails) throw new Error('close failed');
    },
  };
  const config = {};
  const context = createContext({
    URL,
    console: { log: (...args) => output.push(args.join(' ')), error: (...args) => output.push(args.join(' ')) },
    process: {
      env: {
        CMS_ADMIN_NAME: options.name === null ? '' : 'CMS Admin',
        CMS_ADMIN_EMAIL: options.email === null ? '' : (options.email || 'admin@example.com'),
        CMS_ADMIN_ROLE: options.role,
        PAYLOAD_DB_PROVIDER: 'postgres',
        DATABASE_URL: options.database || 'postgresql://fixture:fixture@postgres/scs_cms',
        PAYLOAD_SECRET: options.noSecret ? '' : 'offline-config-fixture',
        PAYLOAD_DROP_DATABASE: 'true',
      },
      exit: (code) => { result = code; },
    },
  });
  const makeModule = async (exports) => {
    const mod = new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
    await mod.link(() => {});
    await mod.evaluate();
    return mod;
  };
  const mod = new SourceTextModule(source, {
    context,
    importModuleDynamically: async (specifier) => {
      if (specifier === 'payload') return makeModule({ getPayload: async (args) => {
        assert.equal(args.disableOnInit, true);
        assert.equal(args.disableDBConnect, true);
        assert.equal(context.process.env.PAYLOAD_DROP_DATABASE, 'false');
        return fakePayload;
      } });
      assert.equal(specifier, 'file:///app/payload.config.ts');
      return makeModule({ default: Promise.resolve(config) });
    },
  });
  await mod.link(async (specifier) => {
    if (specifier === 'node:fs') return makeModule({ readFileSync: () => Buffer.from(options.input ?? `${testPassword}\0${testPassword}`) });
    if (specifier === 'node:path') return makeModule({ resolve: () => '/app/payload.config.ts' });
    if (specifier === 'node:url') return makeModule({ pathToFileURL: () => new URL('file:///app/payload.config.ts') });
    throw new Error(`Unexpected import: ${specifier}`);
  });
  await mod.evaluate();
  const text = output.join('\n');
  for (const secret of [testPassword, 'hidden-salt', 'hidden-hash', 'offline-config-fixture']) {
    assert.ok(!text.includes(secret));
  }
  return { result, calls, text };
}

test('creates the requested account and closes the connection', async () => {
  const result = await run({ role: 'editor', email: 'editor@example.com' });
  assert.equal(result.result, 0);
  assert.deepEqual(result.calls, ['connect', 'find', 'create', 'destroy']);
  assert.match(result.text, /editor@example.com/);
});

test('does not modify an existing account', async () => {
  const result = await run({ exists: true });
  assert.equal(result.result, 1);
  assert.deepEqual(result.calls, ['connect', 'find', 'destroy']);
});

for (const [name, options] of Object.entries({
  missingName: { name: null },
  missingEmail: { email: null },
  invalidRole: { role: 'owner' },
  mismatch: { input: `${testPassword}\0different` },
  shortPassword: { input: 'short\0short' },
  wrongDatabase: { database: 'postgresql://fixture@postgres/scs_core' },
  missingSecret: { noSecret: true },
})) {
  test(`${name}: stops before accessing the database`, async () => {
    const result = await run(options);
    assert.equal(result.result, 1);
    assert.deepEqual(result.calls, []);
  });
}

test('hides raw failures and still closes the connection', async () => {
  const result = await run({ createFails: true });
  assert.equal(result.result, 1);
  assert.equal(result.calls.at(-1), 'destroy');
});

test('warns if cleanup fails after creating the account', async () => {
  const result = await run({ destroyFails: true });
  assert.equal(result.result, 1);
  assert.match(result.text, /Akun sudah dibuat/);
});

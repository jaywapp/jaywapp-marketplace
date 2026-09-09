import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const build = fileURLToPath(new URL('./build-registry.mjs', import.meta.url));
const validate = fileURLToPath(new URL('./validate-plugin.mjs', import.meta.url));
const meta = { name: 'sample', version: '1.0.0', description: 'Sample', author: 'Author', license: 'MIT', tags: ['test'], platforms: ['codex'] };
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'registry-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const plugin = join(root, 'plugins', 'sample');
  mkdirSync(join(plugin, '.codex-plugin'), { recursive: true });
  writeFileSync(join(plugin, 'README.md'), 'Sample');
  writeFileSync(join(plugin, '.codex-plugin', 'plugin.json'), '{}');
  writeFileSync(join(plugin, 'plugin.json'), JSON.stringify(meta));
  return { root, plugin };
}
const run = (script, cwd, args = []) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });

test('valid metadata passes and registry preserves fields', t => {
  const { root, plugin } = fixture(t);
  assert.equal(run(validate, root, [plugin]).status, 0);
  assert.equal(run(build, root).status, 0);
  const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'));
  assert.equal(registry.count, 1);
  assert.deepEqual(registry.plugins[0], { ...meta, path: 'plugins/sample' });
});
test('invalid JSON values fail without an uncaught exception or registry loss', t => {
  const { root, plugin } = fixture(t);
  for (const raw of ['null', '[]', '"text"', '{']) {
    writeFileSync(join(plugin, 'plugin.json'), raw);
    writeFileSync(join(root, 'registry.json'), 'existing');
    const validation = run(validate, root, [plugin]);
    assert.equal(validation.status, 1);
    assert.doesNotMatch(validation.stderr, /TypeError:|at validate/);
    assert.equal(run(build, root).status, 1);
    assert.equal(readFileSync(join(root, 'registry.json'), 'utf8'), 'existing');
  }
});
test('missing input and missing required fields fail', t => {
  const { root, plugin } = fixture(t);
  assert.equal(run(validate, root).status, 1);
  writeFileSync(join(plugin, 'plugin.json'), '{}');
  assert.equal(run(validate, root, [plugin]).status, 1);
});
test('unknown platforms fail and empty registry succeeds', t => {
  const { root, plugin } = fixture(t);
  writeFileSync(join(plugin, 'plugin.json'), JSON.stringify({ ...meta, platforms: ['invalid'] }));
  assert.equal(run(validate, root, [plugin]).status, 1);
  rmSync(plugin, { recursive: true });
  assert.equal(run(build, root).status, 0);
  assert.equal(JSON.parse(readFileSync(join(root, 'registry.json'))).count, 0);
});

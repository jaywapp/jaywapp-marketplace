#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const PLUGINS_DIR = 'plugins';

function buildRegistry() {
  const dirs = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() ||
      (entry.isSymbolicLink() && statSync(join(PLUGINS_DIR, entry.name)).isDirectory()))
    .map((entry) => entry.name);

  const plugins = [];
  let failed = false;

  for (const dir of dirs) {
    const metaPath = join(PLUGINS_DIR, dir, 'plugin.json');
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) {
        throw new TypeError('Plugin metadata must be an object');
      }
      plugins.push({
        name: meta.name,
        version: meta.version,
        description: meta.description,
        author: meta.author,
        license: meta.license,
        tags: meta.tags,
        platforms: meta.platforms,
        path: `${PLUGINS_DIR}/${dir}`,
      });
    } catch {
      failed = true;
      console.warn(`건너뜀 (plugin.json 없음 또는 파싱 실패): ${dir}`);
    }
  }

  if (failed) {
    throw new Error('플러그인 읽기 실패: 기존 registry.json을 보존합니다');
  }

  const registry = {
    updatedAt: new Date().toISOString(),
    count: plugins.length,
    plugins,
  };

  writeFileSync('registry.json', JSON.stringify(registry, null, 2) + '\n', 'utf-8');
  console.log(`✅ registry.json 빌드 완료 (플러그인 ${plugins.length}개)`);
}

try {
  buildRegistry();
} catch (error) {
  console.error(`registry.json 빌드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  process.exitCode = 1;
}

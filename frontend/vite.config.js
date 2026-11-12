import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const I18N_DIR = fileURLToPath(new URL('./src/i18n', import.meta.url));
const PREFIX = 'virtual:i18n/';

// One translation dictionary per language. The site text is written in src/i18n with every language
// side by side (easy to keep in step); this step merges, for one language, all those files in the
// order src/i18n/index.js lists them. The browser then downloads English plus the chosen language
// only, instead of all six. Changing a translation file in dev reloads the page.
function i18nDictionaries() {
  const moduleFiles = () => {
    const index = fs.readFileSync(path.join(I18N_DIR, 'index.js'), 'utf8');
    const list = /MODULE_FILES\s*=\s*\[([\s\S]*?)\]/.exec(index);
    if (!list) throw new Error('src/i18n/index.js: MODULE_FILES not found');
    return [...list[1].matchAll(/'([\w-]+)'/g)].map(m => path.join(I18N_DIR, `${m[1]}.js`));
  };
  return {
    name: 'zenitek-i18n-dictionaries',
    resolveId(id) {
      return id.startsWith(PREFIX) ? `\0${id}` : null;
    },
    async load(id) {
      if (!id.startsWith(`\0${PREFIX}`)) return null;
      const lang = id.slice(PREFIX.length + 1);
      const dict = {};
      for (const file of moduleFiles()) {
        this.addWatchFile(file);
        // the query makes Node read the file again after it changes (dev)
        const mod = await import(`${pathToFileURL(file).href}?v=${fs.statSync(file).mtimeMs}`);
        Object.assign(dict, mod.default?.[lang] || {});
      }
      return `export default ${JSON.stringify(dict)};`;
    },
    handleHotUpdate({ file, server }) {
      if (path.dirname(file) === I18N_DIR) {
        server.moduleGraph.idToModuleMap.forEach((mod, id) => {
          if (id.startsWith(`\0${PREFIX}`)) server.moduleGraph.invalidateModule(mod);
        });
        server.ws.send({ type: 'full-reload' });
        return [];
      }
      return undefined;
    },
  };
}

export default defineConfig({
  plugins: [react(), i18nDictionaries()],
  // html2canvas is imported on demand (bug-report screenshots); pre-bundle it so dev does not reload on first use
  optimizeDeps: { include: ['html2canvas'] },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});

import esbuild from 'esbuild';
import manifestPlugin from 'esbuild-plugin-manifest';
import cssModulesPlugin from 'esbuild-css-modules-plugin';
import fs from 'fs';

export const isWatching = process.argv.includes('-w');
export const isProduction = process.argv.includes('-p');

const RE_ENTRY = /^entries\/(?<entry>\w+)\/(?<file>\w+)(?<ext>\..{2,4})/gm;
const RE_OUT_ENTRY = /^dist\/(?<file>.+)$/gm;

const entries = fs.readdirSync('./entries').reduce((entries, entry) => {
  return { ...entries, [entry]: `./entries/${entry}/${entry}.tsx` };
}, {});

const css = cssModulesPlugin({ inject: true });

const manifest = manifestPlugin({
  generate: (entries) => {
    const manifest = {};
    for (let [key, value] of Object.entries(entries)) {
      const entryMatches = RE_ENTRY.exec(key);
      let ext = entryMatches.groups.ext;
      if (ext === '.ts' || ext === '.tsx') {
        ext = '.js';
      }

      const outMatches = RE_OUT_ENTRY.exec(value);
      manifest[entryMatches.groups.entry + ext] = outMatches.groups.file;

      RE_ENTRY.lastIndex = 0;
      RE_OUT_ENTRY.lastIndex = 0;
    }
    return manifest;
  },
});

const buildLogger = {
  name: 'watchLogger',
  setup(build) {
    build.onEnd((result) => {
      console.log(`✅  Build ended with ${result.errors.length} errors`);
    });
  },
};

let ctx = await esbuild
  .context({
    entryPoints: entries,
    outdir: './dist',
    bundle: true,
    target: 'es6',
    loader: { '.ts': 'ts' },
    sourcemap: !isProduction,
    platform: 'browser',
    minify: isProduction,
    plugins: [css, manifest, buildLogger],
  })
  .catch(() => process.exit(1));

if (isWatching) {
  await ctx.watch();
  await ctx.serve({ servedir: './dist', port: 35729 });
  console.log('💜  Watching...');
} else {
  await ctx.rebuild();
  process.exit(0);
}

import * as esbuild from 'esbuild';
import fs from 'fs'
import sass from 'sass'
import { sassPlugin } from 'esbuild-sass-plugin';
import svgrPlugin from 'esbuild-plugin-svgr';
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import postcssModule from 'postcss-modules'
import path from 'path'
let ctx;
const root = process.cwd();

try {
	ctx = await esbuild.context({
		entryPoints: ['src/index.jsx'],
		bundle: true,
		minify: false,
		sourcemap: true,
		format: "esm",
		loader: { '.svg': 'text', ".module.scss": "local-css", ".png": "dataurl" },
		outfile: 'public/static/bundle.js',
		plugins: [svgrPlugin(), {
			name: "esbuild-replace",
			setup: (build) => {
				build.onLoad({ filter: /.scss/ }, async (args) => {
					let content = await fs.promises.readFile(args.path, 'utf8')
					content = content.replace(/[/]public/, path.resolve(root, "public"))
					content = content.replace(/app/, path.resolve(root, "src/components"))
					content = content.replace(/\/\/.*/g, '');
					console.log(content)
					return { contents: content, loader: "local-css" }
				})
			}
		}],
		define: {
			'process.env.NODE_ENV': "'development'"
		}
	});

	await ctx.watch();
	console.log('Watching client...');

	const { host, port } = await ctx.serve({
		servedir: 'public',
		fallback: 'public/index.html'
	});

	console.info(`Hot refresh at http://${host}:${port}`);
} catch (error) {
	console.error('An error occurred:', error);
	process.exit(1);
}

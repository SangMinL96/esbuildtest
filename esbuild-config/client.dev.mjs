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
		format: "cjs",
		
		loader: { '.svg': 'text', ".module.scss": "local-css", ".png": "dataurl" },
		outfile: 'public/static/bundle.js',
		write: false,
		plugins: [svgrPlugin(), {
			name: "esbuild-url-replace",
			setup: (build) => {
				build.onLoad({ filter: /.module.scss/ }, async (args) => {
					let content = await fs.promises.readFile(args.path, 'utf8')
					content = content.replace(/[/]public/g, path.resolve(root, "public"))
					content = content.replace(/@import ['"]app/, `@import '${path.resolve(root, "src/components")}`)
					content = content.replace(/\/\/.*/g, '');
					return { contents: content, loader: "local-css" }
				})
			}
		},
			// {
			// 	name: "esbuild-html-module",
			// 	setup: (build) => {
			// 		build.onLoad({ filter: /.jsx/ }, async (args) => {
			// 			let content = await fs.promises.readFile(args.path, 'utf8')
			// 			const fileName = args.path.match(/\/([^/]+)\.jsx$/)?.[1];
			// 			content = content.replace(/(?:classs|cx)\("([^"]+)"\)/g, `classs("${fileName}_module_$1")`);
			// 			console.log(content)
			// 			return { contents: content, loader: "jsx" }
			// 		})
			// 	}
			// }
		],
		define: {
			'process.env.NODE_ENV': "'production'"
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

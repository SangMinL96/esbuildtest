import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgrPlugin from 'esbuild-plugin-svgr';
let ctx;

try {
	ctx = await esbuild.context({
		entryPoints: ['src/index.jsx'],
		bundle: true,
		minify: false,
		sourcemap: true,
		loader: {'.svg': 'text'},
		outfile: 'public/static/bundle.js',
		plugins: [sassPlugin(),svgrPlugin()],
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

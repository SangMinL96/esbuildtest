const esbuild = require("esbuild")
const svgr = require("esbuild-plugin-svgr")
const { sassPlugin } = require("esbuild-sass-plugin")
const { config } = require('dotenv');
const fse = require('fs-extra');

const build = async () => {
    config();
    if (fse.existsSync('build')) {
        await fse.rm('build', { recursive: true });
    }
    await fse.copy('./public', 'build');
    const clientEnv = { 'process.env.NODE_ENV': `'production'` };
    for (const key in process.env) {
        if (key.indexOf('CLIENT_') === 0) {
            clientEnv[`process.env.${key}`] = `'${process.env[key]}'`;
        }
    }
    esbuild.build({
        entryPoints: ['src/index.jsx'],
        bundle: true,
        minify: false,
        define: clientEnv,
        loader: { '.png': 'file', '.svg': 'file' },
        outfile: 'build/index.js',
        plugins: [svgr(), sassPlugin()]
    });
};

build();
// const { spawn } = require('child_process');
// const esbuild = require('esbuild');
// const { createServer, request } = require('http');
// const { config } = require('dotenv');
// const handler = require('serve-handler');
// const fse = require('fs-extra');
// const pkg = require("./package.json");
// const external = Object.keys({
//     ...pkg.dependencies,
//     ...pkg.peerDependencies,
// });
import { spawn } from 'child_process';
import { config } from 'dotenv';
import esbuild from 'esbuild';
import { createServer, request } from "http";
import handler from 'serve-handler';


const dev = async () => {
    config();


    const clients = [];

    const openBrowser = () => {
        setTimeout(() => {
            const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] };
            if (clients.length === 0) spawn(op[process.platform][0], ['http://localhost:3000']);
        }, 1000);
    };

    esbuild
        .build({
            entryPoints: ['src/index.jsx'],
            bundle: true,
            outfile: 'dist/index.js',
            // loader: { '.png': 'file', '.svg': 'file', '.js': 'jsx' },
            watch: {
                onRebuild: async (error) => {
                    setTimeout(() => {
                        clients.forEach((res) => res.write('data: update\n\n'));
                    }, 1000);
                    console.log(error || 'client rebuilt');
                },
            },
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });

    esbuild.serve({ servedir: './' }, {}).then((result) => {
        createServer((req, res) => {
            const { url, method, headers } = req;
            if (req.url === '/esbuild') {
                return clients.push(
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Access-Control-Allow-Origin': '*',
                        Connection: 'keep-alive',
                    }),
                );
            }

            const path = url?.split('/').pop()?.indexOf('.') > -1 ? url : `/index.html`;
            console.log(path)
            const proxyReq = request({ hostname: '0.0.0.0', port: 8000, path, method, headers }, (prxRes) => {
                res.writeHead(prxRes.statusCode || 200, prxRes.headers);
                prxRes.pipe(res, { end: true });
            });
            req.pipe(proxyReq, { end: true });
            return null;
        }).listen(5010);

        createServer((req, res) => {
            console.log(req);
            return handler(req, res, { public: 'dist' });
        }).listen(3000);

        openBrowser();
    });
};

dev();


// import { spawn } from 'child_process';
// import esbuild from 'esbuild';
// import { createServer, request } from "http"
// import { config } from 'dotenv'
// import handler from 'serve-handler'
// import fse from 'fs-extra'


// import babel from 'esbuild-plugin-babel';
import { RollupBabelInputPluginOptions, babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy, { CopyOptions } from 'rollup-plugin-copy';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'vite';

import app from './package.json';

const babelConfig: RollupBabelInputPluginOptions = {
	babelHelpers: 'bundled',
	plugins: [
		['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		'@babel/plugin-proposal-export-default-from'
	],
	babelrc: false,
	presets: [['@babel/preset-env', { targets: { chrome: process.env.NODE_ENV == 'development' ? '90' : '55' }, debug: true }]]
};

const copyConfig: CopyOptions = {
	hook: 'closeBundle',
	targets: [
		{ src: 'node_modules/@webcomponents', dest: 'dist/node_modules' },
		{ src: 'public/index.universal.html', dest: 'dist', rename: 'index.html' },
		{ src: 'res', dest: 'dist' }
	]
};
let development = process.env.NODE_ENV != 'production';

// https://vitejs.dev/config/
export default (opts: any) => {
	return defineConfig({
		server: {
			port: Number(process.env.PORT || 3000) 
		},
		define: {
			'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production'),
			'process.env.VERSION': JSON.stringify(app.version)
		},
		plugins: [],
		build: {
			target: 'chrome55',
			assetsInlineLimit: 100000,
			rollupOptions: {
				input: {
					app: './src/lit-app.ts'
				},
				// input: ['src/my-element.ts'],
				// Specifies two JS output configurations, modern and legacy, which the HTML plugin will
				// automatically choose between; the legacy build is compiled to ES5
				// and SystemJS modules
				output: {
					// Legacy JS bundles (ES5 compilation and SystemJS module output)
					format: 'systemjs',
					chunkFileNames: `${process.env.NODE_ENV == 'development' ? '[name].' : 'c.'}[hash].js`,
					entryFileNames: '[name].bundle.js',
					dir: 'dist'
				},
				plugins: [
					// Minify HTML template literals
					minifyHTML(),
					babel(babelConfig),
					// Resolve bare module specifiers to relative paths
					resolve(),
					// Copy res to dist folder
					copy(copyConfig),
					// Minify JS
					terser({
						module: true
					}),
					// Print bundle summary
					summary({}) as any
				],
				preserveEntrySignatures: false
			}
		}
	});
};

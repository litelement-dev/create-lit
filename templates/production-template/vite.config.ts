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
	extensions: ['.js', '.jsx', '.ts', '.tsx'],
	exclude: [/\bcore-js\b/],
	babelrc: false,
	plugins: [
		['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		'@babel/plugin-proposal-export-default-from'
	],
	presets: [['@babel/preset-env', { targets: { chrome: '65' }, useBuiltIns: 'usage', corejs: '3', debug: false }]]
};

const copyConfig: CopyOptions = {
	hook: 'closeBundle',
	targets: [
		{ src: 'node_modules/@webcomponents/webcomponentsjs/*', dest: 'dist/node_modules/@webcomponents/webcomponentsjs' },
		{ src: 'public/index.universal.html', dest: 'dist', rename: 'index.html' },
		{ src: 'res', dest: 'dist' }
	]
};

// https://vitejs.dev/config/
export default (opts: { mode: 'production' | 'development'; command: 'build' | 'serve' }) => {
	return defineConfig({
		server: {
			port: Number(process.env.PORT || 3000)
		},
		define: {
			'process.env.NODE_ENV': JSON.stringify(opts.mode),
			'process.env.VERSION': JSON.stringify(app.version)
		},
		plugins: [],
		build: {
			assetsInlineLimit: 100000,
			commonjsOptions: {
				sourceMap: false
			},
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
					format: 'esm',
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
						format: {
							comments: false
						},
						compress: false,
						module: true
					}),
					// Print bundle summary
					summary({
						showMinifiedSize: false,
						showGzippedSize: false
					}) as any
				],
				preserveEntrySignatures: false
			}
		}
	});
};

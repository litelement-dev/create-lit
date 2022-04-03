<h1 align="center">create-lit</h1>

<p align="center">
	<a href="https://npmcharts.com/compare/create-lit?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/create-lit.svg" height="20"/></a>
	<a href="https://www.npmjs.com/package/create-lit"><img alt="NPM Version" src="https://img.shields.io/npm/v/create-lit.svg" height="20"/></a>
	<a href="https://github.com/litelement-dev/create-lit/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/litelement-dev/create-lit.svg" height="20"/></a>
	<a href="https://github.com/litelement-dev/create-lit/blob/master/CONTRIBUTING.md"><img alt="Contributors" src="https://img.shields.io/badge/PRs-welcome-green.svg" height="20"/></a>
</p>

Create lit is a way to create simple-starter-kit `lit` applications. It offers a modern build setup with [Vite](https://vitejs.dev).

## Quick Start

```bash
npx create-lit my-app
cd my-app
npm run dev
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.

<!-- When you’re ready to deploy to production, use a `production-template` :

```bash
npx create-lit my-app --template production-template
cd my-app
npm run dev
```
-->

## Creating an App

You’ll need to have Node >= 10 on your system

To create a new app, you may choose one of the following methods:

### npx

```bash
npx create-lit my-app
```

(npx comes with npm 5.2+ and higher, see instructions for older npm versions)

### PNPM

```bash
pnpm dlx create-lit my-app
```

### Yarn

```bash
yarn create lit my-app
```

### npm

```bash
npm init lit my-app
```

## Special mention

Thanks to [@uetchy](https://github.com/uetchy) and the repo [create-create-app](https://github.com/uetchy/create-create-app) . This repo ports from CJS to ESM from [create-create-app](https://github.com/uetchy/create-create-app)

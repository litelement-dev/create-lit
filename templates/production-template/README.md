# LitElement starter site

this project has a ready to production configuration.

## Litelement + Typescript + Vitejs + Rollup.js
This project includes a **VERY sample site** to start using LitElement with TypeScript (you can also use JS).

The project tries to have the same structure as an `Android project`. The idea is that it feels familiar and we develop with a standard (or as similar as possible)

This will help the LitElement developer community grow and we all align our efforts in a standardized and orderly direction. 

You will find a `res` folder and within it it should have the same structure as a **Native Android Project**.

With this configuration you can mix and use javascript. But we **highly recommend** that you use Typescript, if you don't already know Typescript you should learn it as this will greatly improve the quality of your code.

# Let's write the future together 🚀
## ⚙ Setup

Install dependencies:

```bash
npm i
#or
yarn
```

## 🚀 Start

This sample uses the `Babel` and `esbuild` with `Vitejs` to produce JavaScript that runs in modern browsers.

### Dev Server

This sample uses [Vitejs](https://vitejs.dev/) for previewing the project without additional build steps. `Vitejs` handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles Typescript to JavaScript files.

There is a development HTML file located at `index.html` that you can view at http://localhost:8000.

To `build` and `run` the JavaScript version of your component (include watcher):

```bash
npm run dev
# or
yarn dev
```


## 📝 Editing (highly recommend)

If you use VS Code, we **highly recommend** the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), made by [@runem](https://github.com/runem) which enables some extremely useful features for lit-html templates:
  - Syntax highlighting
  - Type-checking
  - Code completion
  - Hover-over docs
  - Jump to definition
  - Linting
  - Quick Fixes
  
  The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

**Go to repo to leave a start ★ -> [https://github.com/runem/lit-analyzer](https://github.com/runem/lit-analyzer)**

## 📄 Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when commiting files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

If you use VS code, we reccommend the [prettier-vscode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Contribute and more information

See we develop a [Get started web site (soon)](#) to show more information.
If you have the desire to collaborate, send me a Tweet to [@herberthobregon](https://twitter.com/herberthobregon) and let's talk!
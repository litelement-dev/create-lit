#!/usr/bin/env node

import { resolve } from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { stripIndents } from "common-tags";

import { create } from "../packages/create-app/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templateRoot = resolve(__dirname, "..", "templates");

// See https://github.com/uetchy/create-create-app/blob/master/README.md for the all options.
create("create-lit", {
	templateRoot,
	promptForTemplate: true,
	fallbackAppName: "lit-app",
	modifyName: name => {
		name = name.toLowerCase();
		const regexDashCase = /^[a-z]+(-[a-z]+)*$/;
		if (!regexDashCase.test(name)) {
			throw new Error("Project name must be dash-cased. For example my-app");
		}

		if (!name.includes("-")) {
			console.log(stripIndents`
				NOTE: Because your project name is not dash-case,
				"element" has been added as a suffix.
			`);
			return `${name}-element`;
		}

		return name;
	},
	caveat: ({ name }) => stripIndents`
		Successfully created your Lit project!
		Now run:
		cd ${name}
		npm run dev
	`
});

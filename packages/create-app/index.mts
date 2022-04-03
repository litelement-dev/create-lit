import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import chalk from "chalk";
import { epicfail } from "epicfail";
import { CommonOptions, ExecaChildProcess, execa } from "execa";
import { availableLicenses, makeLicenseSync } from "license.js";
import yargsInteractive, { OptionData } from "yargs-interactive";

import { exists, isOccupied } from "./fs.mjs";
import { getGitUser, initGit } from "./git.mjs";
import { addDeps, getPM, installDeps } from "./npm.mjs";
import { copy, getAvailableTemplates } from "./template.mjs";

const __filename = fileURLToPath(import.meta.url);

export interface Option {
	[key: string]: OptionData | { default: boolean };
}

export interface Options {
	templateRoot: string;
	fallbackAppName?: string;
	promptForTemplate?: boolean;
	promptForPM?: boolean;
	modifyName?: (name: string) => string | Promise<string>;
	extra?: Option;
	caveat?: string | ((options: AfterHookOptions) => string | void | Promise<string | void>);
	after?: (options: AfterHookOptions) => void | Promise<void>;
}

export interface View {
	name: string;
	description: string;
	author: string;
	email: string;
	contact: string;
	license: string;
	[key: string]: string | number | boolean | any[];
}

export interface AfterHookOptions {
	name: string;
	packageDir: string;
	template: string;
	templateDir: string;
	year: number;
	answers: Omit<View, "name">;
	run: (command: string, options?: CommonOptions<string>) => ExecaChildProcess<string>;
	installNpmPackage: (packageName: string) => Promise<void>;
}

export enum NodePM {
	Npm = "npm",
	Yarn = "yarn",
	Pnpm = "pnpm"
}

export class CLIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CLIError";
	}
}

export async function printCommand(...commands: string[]) {
	console.log(chalk.gray(">", ...commands));
}

function getContact(author: string, email?: string) {
	return `${author}${email ? ` <${email}>` : ""}`;
}

async function getYargsOptions(options: Options) {
	const gitUser = await getGitUser();
	const availableTemplates = getAvailableTemplates(options.templateRoot);
	const isMultipleTemplates = availableTemplates.length > 1;
	const askForTemplate = isMultipleTemplates && !!options.promptForTemplate;
	const yargOption: Option = {
		interactive: { default: true },
		description: {
			type: "input",
			describe: "description",
			default: "description",
			prompt: "if-no-arg"
		},
		author: {
			type: "input",
			describe: "author name",
			default: gitUser.name,
			prompt: "if-no-arg"
		},
		email: {
			type: "input",
			describe: "author email",
			default: gitUser.email,
			prompt: "if-no-arg"
		},
		template: {
			type: "list",
			describe: "template",
			default: "default",
			prompt: askForTemplate ? "if-no-arg" : "never",
			choices: availableTemplates
		},
		license: {
			type: "list",
			describe: "license",
			choices: [...availableLicenses(), "UNLICENSED"],
			default: "MIT",
			prompt: "if-no-arg"
		},
		"node-pm": {
			type: "list",
			describe: "select package manager to use for installing packages from npm",
			choices: ["npm", "yarn", "pnpm"],
			default: "npm",
			prompt: options.promptForPM ? "if-no-arg" : "never"
		},
		...options.extra
	};
	return yargOption;
}

export async function create(appName: string, options: Options) {
	epicfail(__filename, {
		assertExpected: err => err.name === "CLIError"
	});

	const firstArg = process.argv[2] || options.fallbackAppName;

	if (firstArg === undefined) {
		throw new CLIError(`${appName} <name>`);
	}

	const useCurrentDir = firstArg === ".";
	const name: string = useCurrentDir ? path.basename(process.cwd()) : options.modifyName ? await Promise.resolve(options.modifyName(firstArg)) : firstArg;
	const packageDir = useCurrentDir ? process.cwd() : path.resolve(name);

	if (isOccupied(packageDir)) {
		throw new CLIError(`"${firstArg}" is not empty directory. Check ${packageDir}`);
	}

	console.log(`\nWelcome to ${chalk.cyan.bold("create-lit")}.\n`);
	console.log(`Creating app on ${chalk.cyan.bold(packageDir)}.\n`);

	const yargsOption = await getYargsOptions(options);
	const args = await yargsInteractive()
		.usage("$0 <name> [args]")
		.interactive(yargsOption as any);

	const template = args.template;
	const templateDir = path.resolve(options.templateRoot, template);
	const year = new Date().getFullYear();
	const contact = getContact(args.author, args.email);

	if (!fs.existsSync(templateDir)) {
		throw new CLIError("No template found");
	}

	const filteredArgs = Object.entries<string>(args)
		.filter(arg => arg[0].match(/^[^$_]/) && !["interactive", "template"].includes(arg[0]))
		.reduce(
			(sum, cur) => ((sum[cur[0]] = cur[1]), sum),
			{} as {
				[key in keyof View]: View[key];
			}
		);

	const view = {
		...filteredArgs,
		name,
		year,
		contact
	};

	// copy files from template
	console.log(`\nCreating a new package in ${chalk.green(packageDir)}.`);
	await copy({
		packageDir,
		templateDir,
		view
	});

	// create license file
	try {
		const license = makeLicenseSync(args.license, {
			year,
			project: name,
			description: args.description,
			organization: getContact(args.author, args.email)
		});
		const licenseText = (license.header ?? "") + license.text + (license.warranty ?? "");
		fs.writeFileSync(path.resolve(packageDir, "LICENSE"), licenseText);
	} catch (e) {
		// do not generate LICENSE
	}

	// init git
	try {
		console.log("\nInitializing a git repository");
		await initGit(packageDir);
	} catch (err: any) {
		if (err?.exitCode == 127) return; // no git available
		throw err;
	}

	const run = async (command: string, options: CommonOptions<string> = {}) => {
		const args = command.split(" ");
		return execa(args[0], args.slice(1), {
			stdio: "inherit",
			cwd: packageDir,
			...options
		});
	};

	// run Node.js related tasks (only if `package.json` does exist in the template root)
	let installNpmPackage = async (packageName: string): Promise<void> => {};

	if (exists("package.json", packageDir)) {
		let packageManager = args["node-pm"];
		if (!options.promptForPM) {
			packageManager = getPM(!!options.promptForPM);
		}

		console.log(`Installing dependencies using ${packageManager}`);
		packageManager = await installDeps(packageDir, packageManager);

		installNpmPackage = async (pkg: string | string[], isDev: boolean = false): Promise<void> => {
			await addDeps({
				rootDir: packageDir,
				deps: Array.isArray(pkg) ? pkg : [pkg],
				isDev,
				pm: packageManager
			});
		};
	}

	const afterHookOptions = {
		name,
		packageDir,
		template,
		templateDir,
		year,
		run: run as any,
		installNpmPackage,
		answers: {
			...filteredArgs,
			contact
		}
	};

	// run after hook script
	if (options.after) {
		await Promise.resolve(options.after(afterHookOptions));
	}

	console.log(`\nSuccessfully created ${chalk.bold.cyan(packageDir)}`);

	// show caveat
	if (options.caveat) {
		switch (typeof options.caveat) {
			case "string":
				console.log(options.caveat);
				break;
			case "function":
				const response = await Promise.resolve(options.caveat(afterHookOptions));
				if (response) {
					console.log(response);
				}
				break;
			default:
		}
	}
}

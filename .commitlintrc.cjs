/**
 * Message: "type(scope): commit message"
 * Example: `git commit -m "feat(scope): Removed before you go" -m "[Ticket-123](https://pivotal-link)"`
 * @see http://marionebl.github.io/commitlint/
 *
 * @commitlint/config-conventional
 * @see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
 */

const type = [
	'build',
	'chore',
	'ci',
	'docs',
	'feat',
	'fix',
	'perf',
	'refactor',
	'revert',
	'style',
	'test'
];

const scope = ['core'];

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [2, 'always', Infinity],
		'type-enum': [2, 'always', type],
		'scope-enum': [2, 'always', scope],
		'footer-leading-blank': [1, 'never'],
		'subject-case': [2, 'always', 'sentence-case']
	},
	parserPreset: {
		parserOpts: {
			issuePrefixes: ['Ticket-']
		}
	}
};

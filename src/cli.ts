#!/usr/bin/env node

import {create} from 'create-create-app';
import {resolve} from 'path';

const templateRoot = resolve(__dirname, '..', 'templates');

// See https://github.com/uetchy/create-create-app/blob/master/README.md for the all options.
create('create-lit', {
  templateRoot,
  promptForTemplate: true,
  extra: {
    includeEslint: {
      type: 'confirm',
      describe: 'Include ESLint + Prettier?',
    },
  },
  modifyName: (name) => {
    const regexDashCase = /^[a-z]+(-[a-z]+)*$/;

    if (!regexDashCase.test(name)) {
      throw new Error('Project name must be dash-cased.');
    }

    if (!name.includes('-')) {
      console.log(`
        NOTE: Because your project name is not dash-case,
        \"element\" has been added as a suffix.`,
      );
      return `${name}-element`;
    }

    return name;
  },
  after: ({answers, run}) => {
    if (answers.includeEslint) {
      run('npx gts init');
    }
  },
  caveat: ({name}) => `
    Successfully created your Lit project!
    cd ${name}
    yarn dev
  `,
});

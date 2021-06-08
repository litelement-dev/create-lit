#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';

const templateRoot = resolve(__dirname, '..', 'templates');

// See https://github.com/uetchy/create-create-app/blob/master/README.md for the all options.

create('create-lit', {
  templateRoot,
  after: ({ run }) => {
    console.log(`Installing npm packages with yarn...`);
    run('yarn');
  },
  modifyName: (name) => {
    if (name.includes('-')) return name;
    else {
      console.log('NOTE: Because your project name is not dash-case, \"element\" has been added as a suffix.');
      return `${name}-element`;
    }
  },
  caveat: ({ answers }) => `
    Successfully created your Lit project!
    cd ${answers.name}
    yarn dev
  `
});

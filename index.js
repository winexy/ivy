import { Environment } from './Environment.js';
import { Ivy } from './Ivy.js';

const ivy = new Ivy(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1'
  })
);


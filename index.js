import assert from 'node:assert';
import { Environment } from './Environment.js';
import { Ivy } from './Ivy.js';

// –––--------------------
// Tests:
// -----------------------

const ivy = new Ivy(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1'
  })
);

assert.strictEqual(ivy.eval(1), 1);
assert.strictEqual(ivy.eval('"hello"'), 'hello');

// Math

assert.strictEqual(ivy.eval(['+', 1, 5]), 6);
assert.strictEqual(ivy.eval(['+', ['+', 3, 2], 5]), 10);
assert.strictEqual(ivy.eval(['+', 1, 5]), 6);
assert.strictEqual(ivy.eval(['+', ['*', 2, 2], 6]), 10);
assert.strictEqual(ivy.eval(['/', ['-', 10, 2], 2]), 4);

// Variables
assert.strictEqual(ivy.eval(['var', 'x', 10]), 10);
assert.strictEqual(ivy.eval('x'), 10);
assert.strictEqual(ivy.eval(['var', 'y', 100]), 100);
assert.strictEqual(ivy.eval('y'), 100);
assert.strictEqual(ivy.eval('null'), null);
assert.strictEqual(ivy.eval('VERSION'), '0.1');
assert.strictEqual(ivy.eval(['var', 'isUser', 'true']), true);

console.log('All assertions passed');

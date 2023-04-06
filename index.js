import assert from 'node:assert';
import { Environment } from './Environment.js';

class Ivy {
  constructor(global = new Environment()) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // Math operations

    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    if (exp[0] === '-') {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }

    if (exp[0] === '*') {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    if (exp[0] === '/') {
      return this.eval(exp[1]) / this.eval(exp[2]);
    }

    // Variable declaration:
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.eval(value));
    }

    // Variable access:
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === 'set') {
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp.startsWith('"') && exp.endsWith('"');
}

function isVariableName(exp) {
  return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

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

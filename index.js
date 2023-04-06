import assert from 'node:assert';

class Ivy {
  eval(exp) {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    throw 'Unimplemented';
  }
}

function isNumber(exp) {
  return typeof exp === 'number';
}

function isString(exp) {
  return typeof exp === 'string' && exp.startsWith('"') && exp.endsWith('"');
}

// –––--------------------
// Tests:
// -----------------------

const ivy = new Ivy();

assert.strictEqual(ivy.eval(1), 1);
assert.strictEqual(ivy.eval('"hello"'), 'hello');
assert.strictEqual(ivy.eval(['+', 1, 5]), 6);
assert.strictEqual(ivy.eval(['+', ['+', 3, 2], 5]), 10);

console.log('All assertions passed');

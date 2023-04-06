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

export { Ivy };

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
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if (exp[0] === '-') {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    if (exp[0] === '*') {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    if (exp[0] === '/') {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }

    // Variable declaration:
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === 'set') {
      const [, name, value] = exp;
      return env.assign(name, this.eval(value, env))
    }

    // Variable access:
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === 'begin') {
      const blockEnvironment = new Environment({}, env);
      return this.#evalBlock(exp.slice(1), blockEnvironment);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  #evalBlock(expressions, env) {
    let result;

    expressions.forEach(exp => {
      result = this.eval(exp, env);
    });

    return result;
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

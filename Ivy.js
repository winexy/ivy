import { Environment } from './Environment.js';

class Ivy {
  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    if (this.#isNumber(exp)) {
      return exp;
    }

    if (this.#isString(exp)) {
      return exp.slice(1, -1);
    }

    // Variable declaration:
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === 'set') {
      const [, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // Variable access:
    if (this.#isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === 'begin') {
      const blockEnvironment = new Environment({}, env);
      return this.#evalBlock(exp.slice(1), blockEnvironment);
    }

    if (exp[0] === 'if') {
      const [, condition, consequent, alternative] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      } else {
        return this.eval(alternative, env);
      }
    }

    if (exp[0] === 'while') {
      const [, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // Function declaration:
    if (exp[0] === 'fun') {
      const [, name, params, body] = exp;
      
      const fn = {
        name,
        params,
        body,
        env // Closure
      };

      return env.define(name, fn);
    }

    // Function calls:
    // (print "hello world")
    // (+ x 5)
    // (> foo bar)

    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map(arg => this.eval(arg, env));

      // Native functions
      if (typeof fn === 'function') {
        return fn(...args);
      }

      // User defined functions:
      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(activationRecord, fn.env);

      return this.#evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  #evalBody(body, env) {
    if (body[0] === 'begin') {
      return this.#evalBlock(body.slice(1), env);
    }

    return this.eval(body, env);
  }

  #evalBlock(expressions, env) {
    let result;

    expressions.forEach(exp => {
      result = this.eval(exp, env);
    });

    return result;
  }

  #isNumber(exp) {
    return typeof exp === 'number';
  }

  #isString(exp) {
    return typeof exp === 'string' && exp.startsWith('"') && exp.endsWith('"');
  }

  #isVariableName(exp) {
    return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
  }
}

// Default Global Environment
const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: '0.1',
  '+'(op1, op2) {
    return op1 + op2;
  },
  '-'(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }

    return op1 - op2;
  },
  '/'(op1, op2) {
    return op1 / op2;
  },
  '*'(op1, op2) {
    return op1 * op2;
  },
  '>'(op1, op2) {
    return op1 > op2;
  },
  '<'(op1, op2) {
    return op1 < op2;
  },
  '>='(op1, op2) {
    return op1 >= op2;
  },
  '<='(op1, op2) {
    return op1 <= op2;
  },
  '='(op1, op2) {
    return op1 === op2;
  },
  print(...args) {
    console.log(...args);
  }
});

export { Ivy };

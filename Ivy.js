import { Environment } from './Environment.js';
import { Transformer } from './Transformer.js';

class Ivy {
  #transformer = new Transformer();
  #callStack = [];

  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  eval(exp, env = this.global) {
    try {
      return this.#eval(exp, env);
    } catch (cause) {
      const error = new Error(cause.message);
      error.stack = this.#callStack
        .map(call => `  at ${call.name}`)
        .reverse()
        .join('\n');

      this.#callStack = [];

      throw error;
    }
  }

  #eval(exp, env = this.global) {
    if (this.#isNumber(exp)) {
      return exp;
    }

    if (this.#isString(exp)) {
      return exp.slice(1, -1);
    }

    // Variable declaration:
    if (exp[0] === 'var') {
      const [, name, value] = exp;
      return env.define(name, this.#eval(value, env));
    }

    if (exp[0] === 'set') {
      const [, ref, value] = exp;

      if (ref[0] === 'prop') {
        const [, instance, propName] = ref;
        const instanceEnv = this.#eval(instance, env);

        return instanceEnv.define(propName, this.#eval(value, env));
      }
      return env.assign(ref, this.#eval(value, env));
    }

    // Variable access:
    if (this.#isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (exp[0] === '++') {
      const setExpression = this.#transformer.transformIncToSet(exp);
      return this.#eval(setExpression, env);
    }

    if (exp[0] === '--') {
      const setExpression = this.#transformer.transformDecToSet(exp);
      return this.#eval(setExpression, env);
    }

    if (exp[0] === 'begin') {
      const blockEnvironment = new Environment({}, env);
      return this.#evalBlock(exp.slice(1), blockEnvironment);
    }

    if (exp[0] === 'if') {
      const [, condition, consequent, alternative] = exp;
      if (this.#eval(condition, env)) {
        return this.#eval(consequent, env);
      } else {
        return this.#eval(alternative, env);
      }
    }

    if (exp[0] === 'for') {
      const expression = this.#transformer.transformForToWhile(exp);
      return this.#eval(expression, env);
    }

    if (exp[0] === 'while') {
      const [, condition, body] = exp;
      let result;
      while (this.#eval(condition, env)) {
        result = this.#eval(body, env);
      }
      return result;
    }

    if (exp[0] === 'switch') {
      const expression = this.#transformer.transformSwitchToIf(exp);
      return this.#eval(expression, env);
    }

    // Function declaration:
    if (exp[0] === 'fun') {
      const [, name, params, body] = exp;

      const fn = {
        name,
        params,
        body,
        env
      };

      return env.define(name, fn);
    }

    // Lambda expression
    if (exp[0] === 'lambda') {
      const [, params, body] = exp;

      const fn = {
        name: 'anonymous',
        params,
        body,
        env
      };

      return fn;
    }

    // Class declaration: (class <Name> <Parent> <Body>)
    if (exp[0] === 'class') {
      const [, name, parent, body] = exp;

      // a class is an environment -- a storage of methods and shared properties
      const parentEnv = this.#eval(parent, env) || env;
      const classEnv = new Environment({}, parentEnv);

      // body is evaluated in the class environment
      this.#evalBody(body, classEnv);

      return env.define(name, classEnv);
    }

    // Class instantiation:  (new <Class> <Arguments>...)
    if (exp[0] === 'new') {
      const classEnv = this.#eval(exp[1], env);

      // An instance of a class is an environment
      // The `parent` component of the instance environment is set to its class
      const instanceEnv = new Environment({}, classEnv);

      const args = exp.slice(2).map(arg => this.#eval(arg, env));

      this.#callUserDefinedFunction(classEnv.lookup('constructor'), [
        instanceEnv,
        ...args
      ]);

      return instanceEnv;
    }

    // Property access: (prop <instance> <name>)
    if (exp[0] === 'prop') {
      const [, instance, name] = exp;
      const instanceEnv = this.#eval(instance, env);

      return instanceEnv.lookup(name);
    }

    // Function calls:
    // (print "hello world")
    // (+ x 5)
    // (> foo bar)

    if (Array.isArray(exp)) {
      const fn = this.#eval(exp[0], env);
      const args = exp.slice(1).map(arg => this.#eval(arg, env));

      // Native functions
      if (typeof fn === 'function') {
        this.#callStack.push(fn);
        const result = fn(...args);
        this.#callStack.pop();
        return result;
      }

      return this.#callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  #callUserDefinedFunction(fn, args) {
    // User defined functions:
    const activationRecord = {};

    fn.params.forEach((param, index) => {
      activationRecord[param] = args[index];
    });

    const activationEnv = new Environment(activationRecord, fn.env);

    this.#callStack.push(fn);
    const result = this.#evalBody(fn.body, activationEnv);
    this.#callStack.pop();
    return result;
  }

  #evalBody(body, env) {
    if (body[0] === 'begin') {
      return this.#evalBlock(body.slice(1), env);
    }

    return this.#eval(body, env);
  }

  #evalBlock(expressions, env) {
    let result;

    expressions.forEach(exp => {
      result = this.#eval(exp, env);
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

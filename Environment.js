class Environment {
  constructor(predefinedEnv = {}, parentEnv = null) {
    this.record = new Map(Object.entries(predefinedEnv));
    this.parentEnv = parentEnv;
  }

  define(name, value) {
    this.record.set(name, value);
    return value;
  }

  assign(name, value) {
    const env = this.#resolve(name);
    env.record.set(name, value);
    return env.record.get(name);
  }

  lookup(name) {
    const env = this.#resolve(name);
    return env.record.get(name);
  }

  #resolve(name) {
    if (this.record.has(name)) {
      return this;
    }

    if (this.parentEnv === null) {
      throw new ReferenceError(`Variable ${name} is not defined.`);
    }

    return this.parentEnv.#resolve(name);
  }
}

export { Environment };

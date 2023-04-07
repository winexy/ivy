class Environment {
  constructor(predefinedEnv = {}, parentEnv = null) {
    this.record = new Map(Object.entries(predefinedEnv));
  }

  define(name, value) {
    this.record.set(name, value);
    return value;
  }

  assign() {}

  lookup(name) {
    if (!this.record.has(name)) {
      throw new ReferenceError(`Variable ${name} is not defined.`);
    }

    return this.record.get(name);
  }
}

export { Environment };

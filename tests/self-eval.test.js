import assert from 'node:assert';

export default ivy => {
  assert.strictEqual(ivy.eval(1), 1);
  assert.strictEqual(ivy.eval('"hello"'), 'hello');
};

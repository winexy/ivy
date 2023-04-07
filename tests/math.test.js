import assert from 'node:assert';

export default ivy => {
  assert.strictEqual(ivy.eval(['+', 1, 5]), 6);
  assert.strictEqual(ivy.eval(['+', ['+', 3, 2], 5]), 10);
  assert.strictEqual(ivy.eval(['+', 1, 5]), 6);
  assert.strictEqual(ivy.eval(['+', ['*', 2, 2], 6]), 10);
  assert.strictEqual(ivy.eval(['/', ['-', 10, 2], 2]), 4);
};

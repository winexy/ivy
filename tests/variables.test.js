import assert from 'node:assert';

export default ivy => {
  assert.strictEqual(ivy.eval(['var', 'x', 10]), 10);
  assert.strictEqual(ivy.eval('x'), 10);
  assert.strictEqual(ivy.eval(['var', 'y', 100]), 100);
  assert.strictEqual(ivy.eval('y'), 100);
  assert.strictEqual(ivy.eval('null'), null);
  assert.strictEqual(ivy.eval('VERSION'), '0.1');
  assert.strictEqual(ivy.eval(['var', 'isUser', 'true']), true);
};

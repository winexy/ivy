import assert from 'assert';
import ivyParser from '../parser/ivyParser.cjs';

function test(ivy, code, expected) {
  const expression = ivyParser.parse(`(begin ${code})`);
  assert.strictEqual(ivy.evalGlobal(expression), expected);
}

export { test };

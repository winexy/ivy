import assert from 'assert';
import ivyParser from '../parser/ivyParser.cjs'

function test(ivy, code, expected) {
  const expression = ivyParser.parse(code);
  assert.strictEqual(ivy.eval(expression), expected);
}

export const testUtil = { test };

import assert from 'node:assert';
import { test } from './test-util.js';

export default ivy => {
  assert.strictEqual(
    ivy.eval([
      'begin',
      ['var', 'x', 10],
      ['var', 'y', 20],
      ['+', ['*', 'x', 'y'], 30]
    ]),
    230
  );

  assert.strictEqual(
    ivy.eval([
      'begin',
      ['var', 'x', 10],
      ['begin', ['var', 'x', 20], 'x'],
      'x'
    ]),
    10
  );

  assert.strictEqual(
    ivy.eval([
      'begin',
      ['var', 'value', 10],
      ['var', 'result', ['begin', ['var', 'x', ['+', 'value', 10]], 'x']],
      'result'
    ]),
    20
  );

  assert.strictEqual(
    ivy.eval([
      'begin',
      ['var', 'data', 10],
      ['begin', ['set', 'data', 100]],
      'data'
    ]),
    100
  );

  assert.strictEqual(
    ivy.eval([
      'begin',
      ['var', 'data', 10],
      ['var', 'result', 'null'],
      ['set', 'result', 'data']
    ]),
    10
  );

  test(
    ivy,
    `
    (begin
      (var x 10.5)
      (var y 20)
      (+ (* x 10) y))
  `,
    125
  );
};

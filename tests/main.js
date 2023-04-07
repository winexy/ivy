import { Environment } from '../Environment.js';
import { Ivy } from '../Ivy.js';

const testsFiles = [
  import('./self-eval.test.js'),
  import('./math.test.js'),
  import('./variables.test.js'),
  import('./blocks.test.js'),
  import('./if.test.js'),
  import('./while.test.js')
];

const ivy = new Ivy(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1'
  })
);

const tests = await Promise.all(testsFiles);

for (const test of tests) {
  test.default(ivy);
}

console.log('All tests passed!');

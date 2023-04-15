import { Environment } from '../Environment.js';
import { Ivy } from '../Ivy.js';

const testsFiles = [
  './self-eval.test.js',
  './math.test.js',
  './variables.test.js',
  './blocks.test.js',
  './if.test.js',
  './while.test.js',
  './build-in-functions.test.js'
];

const ivy = new Ivy();

for await (const importPath of testsFiles) {
  const test = await import(importPath);
  console.log('- Running tests from', importPath);
  test.default(ivy);
}

ivy.eval(['print', '"hello"', '"world"']);

console.log('All tests passed!');

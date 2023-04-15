import { test } from './test-util.js';

export default ivy => {
  test(ivy, `(+ 1 5)`, 6);
  test(ivy, `(+ (+ 3 2) 5)`, 10);
  test(ivy, `(+ 1 5)`, 6);
  test(ivy, `(+ (* 2 2) 6)`, 10);
  test(ivy, `(/ (- 10 2) 2)`, 4);
};

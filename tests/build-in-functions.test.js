import { test } from './test-util.js';

export default ivy => {
  test(ivy, `(+ 1 5)`, 6);
  test(ivy, `(+ (+ 3 2) 5)`, 10);
  test(ivy, `(+ (* 2 2) 6)`, 10);

  test(ivy, `(< 1 5)`, true);
  test(ivy, `(> 1 5)`, false);

  test(ivy, `(>= 4 2)`, true);
  test(ivy, `(<= 4 2)`, false);
  test(ivy, `(= 4 4)`, true);

  test(ivy, '(++ 10)', 11)
  test(ivy, '(-- 10)', 9)
};

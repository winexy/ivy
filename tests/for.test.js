import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `(for (var i 0)
          (< i 10)
          (++ i)
          (print i))
    `,
    10
  );
};

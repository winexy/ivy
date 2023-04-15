import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
      (begin
        (var x 10)
        (switch ((= x 10) 100)
                ((> x 10) 200)
                (else 300))
      )
    `,
    100
  );
};

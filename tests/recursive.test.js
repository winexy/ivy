import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
      (begin
        (fun factorial (n)
          (if (= n 1)
            1
            (* n (factorial (- n 1)))))
        (factorial 5)
      )
    `,
    120
  )
};

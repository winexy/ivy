import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
      (begin
        (var x (lambda (x) (* x x)))
        (x 10)
      )`,
    100
  );

  test(ivy, `((lambda (x) (* x x)) 10)`, 100);

  test(
    ivy,
    `
    (begin
      (fun onClick (callback)
        (begin
          (var x 10)
          (var y 20)
          (callback (+ x y))
        ))

      (onClick (lambda (data) (* data 10)))
    )
    `,
    300
  );
};

import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
      (begin
        (class Point null
          (begin

            (fun constructor (self x y)
              (begin
                (set (prop self x) x)
                (set (prop self y) y)))
                
            (fun calc (self)
              (+ (prop self x) (prop self y)))))

        (var p (new Point 10 20))

        ((prop p calc) p)
      )
    `,
    30
  );

  // test(
  //   ivy,
  //   `
  //     (begin

  //     )
  //   `,
  //   30
  // )
};

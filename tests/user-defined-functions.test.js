import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
      (begin
        (fun square (x)
          (* x x))
          
        (square 10)
      )
    `,
    100
  );

  test(
    ivy,
    `
      (begin
        (fun calc (x y)
          (begin 
            (var z 30)
            (+ (* x y) z)
          )
        )
          
        (calc 10 20)
      )
    `,
    230
  );

  test(
    ivy,
    `
      (begin
        (var x 10)
        (fun foo () x)
        (fun bar ()
          (begin
            (var x 20)
            (+ (foo) x)))
            
        (bar)
      )
    `,
    30
  )
};

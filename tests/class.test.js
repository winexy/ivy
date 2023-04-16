import { test } from './test-util.js';

export default ivy => {
  test(
    ivy,
    `
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
    `,
    30
  );

  test(
    ivy,
    `
      (class Point3D Point
        (begin
          (fun constructor (self x y z)
            (begin
              ((prop (super Point3D) constructor) self x y)
              (set (prop self z) z)))
              
            (fun calc (self)
              (+ ((prop (super Point3D) calc) self)
                 (prop self z)))))

      (var p (new Point3D 10 20 30))

      ((prop p calc) p)
    `,
    60
  )
};

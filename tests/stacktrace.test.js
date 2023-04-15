import assert from 'assert';
import ivyParser from '../parser/ivyParser.cjs';

export default ivy => {
  const ast = ivyParser.parse(
    `
      (begin
        (fun one () 1)
        (fun two () undefined)

        (fun foo () (+ (one) (two)))
        (fun bar () (foo))
        (fun baz () (bar))

        (baz)
      )
    `
  );

  try {
    ivy.eval(ast);

    assert.strictEqual(false, 'This line should never execute');
  } catch (error) {
    assert.strictEqual(error.message, 'Variable undefined is not defined.');
    assert.strictEqual(
      error.stack,
      ['  at two', '  at foo', '  at bar', '  at baz'].join('\n')
    );
  }
};

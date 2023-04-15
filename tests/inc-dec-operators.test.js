import { test } from './test-util.js';

export default ivy => {
  test(
    ivy, 
    `
      (begin 
        (var x 10)
        (++ x)
        x
      )
    `, 
    11
  )

  test(
    ivy, 
    `
      (begin 
        (var x 10)
        (-- x)
        x
      )
    `, 
    9
  )
}
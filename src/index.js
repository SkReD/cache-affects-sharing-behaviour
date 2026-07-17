import { memoize } from 'lodash-es'

const sum = memoize((a, b) => a + b)
export function testMain(a, b) {
  return sum(a,  b)
}

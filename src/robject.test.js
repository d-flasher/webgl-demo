import { RObject } from './robject.js'

describe('RObject', () => {
  test('read', () => {
    expect(true).toBeTruthy()

    let target = {
      v1: 1,
      v2: 'qwerty',
    }
    target = new RObject().create(target)
    target.v1 = 2
  })
})

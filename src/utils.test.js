import Utils from './utils.js'

describe('Utils', () => {
  test('proxy factory', () => {

    let target = {
      v1: 1,
      v2: 'qwerty',
    }
    const fn = jest.fn()

    const { target: target2, eventEmitter } = Utils.create(target)
    eventEmitter.on(fn)
    expect(fn).toBeCalledTimes(0)

    target2.v1 = 2
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith('v1', 2)
  })
})

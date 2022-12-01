import Utils from './utils.js'

describe('Utils', () => {
  test('createdProxy', () => {

    let target = {
      v1: 1
    }
    const fn = jest.fn()

    target = Utils.createProxy(target, fn)
    expect(fn).toBeCalledTimes(0)

    target.v1 = 2
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith('v1', 2)

    target.v1 = 3
    expect(fn).toBeCalledTimes(2)
    expect(fn).toBeCalledWith('v1', 3)

    target.v1 = 3
    expect(fn).not.toBeCalledTimes(3)

    target.v1 = {}
    expect(fn).toBeCalledTimes(3)
    expect(fn).toBeCalledWith('v1', {})

    target['v2'] = true
    expect(fn).toBeCalledTimes(4)
    expect(fn).toBeCalledWith('v2', true)
  })
})

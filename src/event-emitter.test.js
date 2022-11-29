import EventEmitter from './event-emitter.js'

describe('EventEmitter', () => {
  test('base test', () => {
    const emitter = new EventEmitter()
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    // on
    emitter.on(fn1)
    emitter.on(fn2)
    expect(fn1).toBeCalledTimes(0)
    expect(fn2).toBeCalledTimes(0)

    // emit
    emitter.emit()

    expect(fn1).toBeCalledTimes(1)
    expect(fn1).toBeCalledWith()

    expect(fn2).toBeCalledTimes(1)
    expect(fn2).toBeCalledWith()

    // emit with arguments
    emitter.emit(1, '2', true)

    expect(fn1).toBeCalledTimes(2)
    expect(fn1).not.toBeCalledWith(1, 2, true)
    expect(fn1).toBeCalledWith(1, '2', true)

    expect(fn2).toBeCalledTimes(2)
    expect(fn2).not.toBeCalledWith(1, 2, true)
    expect(fn2).toBeCalledWith(1, '2', true)

    // of "fn1"
    emitter.of(fn1)
    expect(fn1).toBeCalledTimes(2)
    expect(fn2).toBeCalledTimes(2)
    emitter.emit(2, '3')
    expect(fn1).toBeCalledTimes(2)
    expect(fn1).not.toBeCalledWith(2, '3')
    expect(fn2).toBeCalledTimes(3)
    expect(fn2).toBeCalledWith(2, '3')
  })
})

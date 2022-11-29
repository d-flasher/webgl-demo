import EventEmitter from './event-emitter.js'

export class RObject {
  create(target) {
    const eventEmitter = new EventEmitter()

    return {
      eventEmitter,
      target: new Proxy(target, {
        set(target, prop, val) {
          eventEmitter.emit(prop, val)
          return Reflect.set(...arguments)
        }
      })
    }
  }
}

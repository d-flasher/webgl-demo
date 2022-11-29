export class RObject {
  static EVENT_CHANGED = 'changed'

  create(target) {
    return new Proxy(target, {
      set(target, prop, val) {
        console.log('pr', prop, val)
        return Reflect.set(...arguments)
      }
    })
  }
}

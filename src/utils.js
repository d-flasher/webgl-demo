class Utils {
  static create(target, onChanged) {
    return new Proxy(target, {
      set(target, prop, val) {
        if (target[prop] == val) return true
        onChanged(prop, val)
        return Reflect.set(...arguments)
      }
    })
  }
}
export default Utils

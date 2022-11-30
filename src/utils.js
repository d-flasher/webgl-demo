class Utils {
  static create(target, onChanged) {
    return new Proxy(target, {
      set(target, prop, val) {
        if (target[prop] == val) return true
        const result = Reflect.set(...arguments)
        if (result) onChanged(prop, val)
        return result
      }
    })
  }
}
export default Utils

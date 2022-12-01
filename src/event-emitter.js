class EventEmitter {
  _callbacks = new Set()

  on(callback) { this._callbacks.add(callback) }
  of(callback) { this._callbacks.delete(callback) }
  emit(...args) {
    this._callbacks.forEach(callback => callback(...args))
  }
}
export default EventEmitter

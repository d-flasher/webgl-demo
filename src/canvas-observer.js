export class CanvasObserver {
  /**
   * @param {HTMLCanvasElement} canvas 
   * @param {WebGL2RenderingContext} webglContext
   */
  constructor(canvas, webglContext) {
    /** @type {HTMLCanvasElement} */
    this._canvasEl = canvas
    /** @type {WebGL2RenderingContext} */
    this._webglContext = webglContext
    /** @type {ResizeObserver} */
    this._observer = null

    this._canvasEl.width = canvas.clientWidth
    this._canvasEl.height = canvas.clientHeight
    this._webglContext.viewport(0, 0, this._canvasEl.width, this._canvasEl.height)
  }

  start() {
    if (this._observer) return

    this._observer = new ResizeObserver(() => {
      this._canvasEl.width = canvas.clientWidth
      this._canvasEl.height = canvas.clientHeight
      this._webglContext.viewport(0, 0, this._canvasEl.width, this._canvasEl.height)
    })
    this._observer.observe(this._canvasEl)
  }

  stop() {
    if (!this._observer) return
    this._observer.disconnect()
    this._observer = null
  }
}

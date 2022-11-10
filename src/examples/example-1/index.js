import { InputRange } from '../../input-range.js'

export class Index {
  constructor() {
    const canvasEl = document.querySelector('canvas')

    /** @type {WebGL2RenderingContext} */
    const gl = canvasEl.getContext('webgl2')

    const data = {
      x1: 0.0, y1: 1.0, z1: 0.0,
      x2: -1.0, y3: -1.0, z3: 0.0,
      x3: 1.0, y2: -1.0, z2: 0.0,
    }
    const programObject = Utils.createProgram(gl)
    const buffer = gl.createBuffer()

    const render = (isViewportChanged) => {
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (isViewportChanged) gl.viewport(0, 0, canvasEl.width, canvasEl.height)
      gl.useProgram(programObject)

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        data.x1, data.y1, data.z1,
        data.x2, data.y2, data.z2,
        data.x3, data.y3, data.z3,
      ]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    this._canvasResizeHandling(canvasEl, () => render(true))
    this._initControls(data, () => render(false))
  }

  /**
   * @param {HTMLCanvasElement} canvasEl 
   * @param {*} onResize 
   */
  _canvasResizeHandling(canvasEl, onResize) {
    canvasEl.width = canvasEl.clientWidth
    canvasEl.height = canvasEl.clientHeight

    new ResizeObserver(() => {
      canvasEl.width = canvasEl.clientWidth
      canvasEl.height = canvasEl.clientHeight
      onResize()
    }).observe(canvasEl)
  }

  _initControls(targetData, onChanged) {
    const initControl = fieldName => {
      const inputEl = document.querySelector('#' + fieldName)
      inputEl.setAttribute('value', targetData[fieldName])

      inputEl.addEventListener(InputRange.EVENT_INPUT,
        /** @param {CustomEvent} event */
        event => {
          targetData[fieldName] = event.detail
          inputEl.setAttribute('value', targetData[fieldName])
          onChanged()
        }
      )
    }
    initControl('x1')
    initControl('y1')
    initControl('z1')
    initControl('x2')
    initControl('y2')
    initControl('z2')
    initControl('x3')
    initControl('y3')
    initControl('z3')
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new Index()
})

class Utils {
  /**
   * @param {WebGL2RenderingContext} gl 
   * @param {*} type 
   * @param {*} shaderSrc 
   * @returns {WebGLShader}
   */
  static loadShader(gl, type, shaderSrc) {
    const shader = gl.createShader(type)
    if (shader == null) return

    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
      const infoLen = gl.getShaderInfoLog(shader)
      console.warn(infoLen)
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  /**
   * @param {WebGL2RenderingContext} gl 
   * @returns {WebGLProgram}
   */
  static createProgram(gl) {
    const vStaderStr = `#version 300 es
      layout(location = 0) in vec4 vPosition;
      void main() {
        gl_Position = vPosition;
      }
    `

    const fShaderStr = `#version 300 es
      precision mediump float;
      out vec4 fragColor;
      void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `

    const vertexShader = Utils.loadShader(gl, gl.VERTEX_SHADER, vStaderStr)
    const fragmentShader = Utils.loadShader(gl, gl.FRAGMENT_SHADER, fShaderStr)

    const programObject = gl.createProgram()
    if (programObject == null) return

    gl.attachShader(programObject, vertexShader)
    gl.attachShader(programObject, fragmentShader)

    gl.linkProgram(programObject)

    const success = gl.getProgramParameter(programObject, gl.LINK_STATUS)
    if (!success) {
      const infoStr = gl.getProgramInfoLog(programObject)
      console.warn(infoStr)
      gl.deleteProgram(programObject)
      return null
    }

    return programObject
  }
}

import { InputRange } from '../../src/inputs/input-range.js'
import Utils from '../../src/utils.js'

/**
 * @typedef {Object} Options
 * @property {number} x1
 * @property {number} y1
 * @property {number} z1
 * @property {number} x2
 * @property {number} y2
 * @property {number} z2
 * @property {number} x3
 * @property {number} y3
 * @property {number} z3
 * @property {boolean} faceCulling
 */

export class Index {

  constructor() {
    const canvasEl = document.querySelector('canvas')

    /** @type {WebGL2RenderingContext} */
    const gl = canvasEl.getContext('webgl2')

    /** @type {Options} */
    let initData = {
      x1: 0.0, y1: 0.9, z1: 0.0,
      x2: -0.9, y3: -0.9, z3: 0.0,
      x3: 0.9, y2: -0.9, z2: 0.0,
      faceCulling: false,
    }

    /** @type {Options} */
    let data = Utils.createProxy(Object.assign({}, initData), (p, v) => {
      const inputEl = document.querySelector('#' + p)
      inputEl.setAttribute('value', data[p])
      render(false)
    })

    const programObject = WebGLUtils.createProgram(gl)
    const buffer = gl.createBuffer()

    const render = (isViewportChanged) => {
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (data.faceCulling) gl.enable(gl.CULL_FACE)
      else gl.disable(gl.CULL_FACE)

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
    this._initControls(data)

    document.querySelector('#reset-btn').addEventListener('click', () => {
      Object.assign(data, initData)
    })
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

  _initControls(targetData) {
    const initControl = fieldName => {
      const inputEl = document.querySelector('#' + fieldName)
      inputEl.setAttribute('value', targetData[fieldName])

      inputEl.addEventListener(InputRange.EVENT_INPUT,
        /** @param {CustomEvent} event */
        event => {
          targetData[fieldName] = event.detail
        }
      )
    }

    Object.keys(targetData).forEach(p => initControl(p))
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new Index()
})

class WebGLUtils {
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

    const vertexShader = WebGLUtils.loadShader(gl, gl.VERTEX_SHADER, vStaderStr)
    const fragmentShader = WebGLUtils.loadShader(gl, gl.FRAGMENT_SHADER, fShaderStr)

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

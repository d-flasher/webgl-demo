export class Index {
  constructor() {
    const canvas = document.querySelector('canvas')

    /** @type {WebGL2RenderingContext} */
    const gl = canvas.getContext('webgl2')

    const programObject = Utils.createProgram(gl)

    const vVerices = new Float32Array([
      0.0, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
    ])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vVerices, gl.STATIC_DRAW)

    gl.viewport(0, 0, 300, 300)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    gl.useProgram(programObject)

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, vVerices)
    gl.enableVertexAttribArray(0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
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

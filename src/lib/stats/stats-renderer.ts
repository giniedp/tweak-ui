import { sampler, Sampler, SamplerConfig } from './sampler'

export type StatsConfig<T extends SamplerConfig = SamplerConfig> = {
  historySize?: number
  collapsed?: boolean
  rows: Array<T>
}

export type StatsRenderer = {
  resize: (width: number, height: number) => void
  configure: (config: StatsConfig) => void
  update: () => void
  render: () => void
  sampler: (row: number) => Sampler
  samplerCount: number
}

export function statsRenderer(canvas: HTMLCanvasElement): StatsRenderer {
  const gl = canvas.getContext('webgl2')!
  if (!gl) {
    throw new Error('WebGL2 is not supported in this browser')
  }

  const prog = createProgram(gl)
  const vbo = gl.createBuffer()

  const locX = 0
  const locRow = 1
  const locVal = 2

  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.enableVertexAttribArray(locX)
  gl.enableVertexAttribArray(locRow)
  gl.enableVertexAttribArray(locVal)

  gl.vertexAttribPointer(locX, 1, gl.FLOAT, false, 12, 0)
  gl.vertexAttribPointer(locRow, 1, gl.FLOAT, false, 12, 4)
  gl.vertexAttribPointer(locVal, 1, gl.FLOAT, false, 12, 8)

  const uHistory = gl.getUniformLocation(prog, 'u_history')
  const uViewWidth = gl.getUniformLocation(prog, 'u_width')
  const uViewHeight = gl.getUniformLocation(prog, 'u_height')
  const uRowHeight = gl.getUniformLocation(prog, 'u_rowH')
  const uPad = gl.getUniformLocation(prog, 'u_padding')
  const uColor = gl.getUniformLocation(prog, 'u_color')

  let collapsed = false
  let history = 100
  let rows = 0
  let verts: Float32Array
  let data: Float32Array
  let head: Uint32Array

  const colors: Array<[number, number, number]> = []
  const samplers: Sampler[] = []
  function configure(config: StatsConfig) {
    collapsed = !!config.collapsed
    rows = config.rows.length
    history = Math.max(config.historySize || 100, 100)
    data = new Float32Array(rows * history)
    head = new Uint32Array(rows)
    verts = new Float32Array(rows * history * 3)

    samplers.length = rows
    colors.length = rows
    for (let i = 0; i < rows; i++) {
      samplers[i] = sampler(config.rows[i], history)
      const hex = config.rows[i].color!
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      colors[i] = [r, g, b]
    }
  }

  function resize(width: number, height: number) {
    canvas.width = width
    canvas.height = height
  }

  function update() {
    for (let i = 0; i < samplers.length; i++) {
      head[i] = (head[i] + 1) % history
      data[i * history + head[i]] = samplers[i].sample()
    }
  }

  function render() {
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < history; i++) {
        const idx = (head[r] + i + 1) % history
        const base = (r * history + i) * 3

        verts[base + 0] = i
        verts[base + 1] = collapsed ? 0 : r
        verts[base + 2] = data[r * history + idx]
      }
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const padding = 0
    gl.useProgram(prog)
    gl.uniform1f(uHistory, history)
    gl.uniform1f(uViewWidth, canvas.width)
    gl.uniform1f(uViewHeight, canvas.height)
    gl.uniform1f(uPad, padding)
    gl.uniform1f(uRowHeight, (canvas.height - padding - rows * padding) / (collapsed ? 1 : rows))

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW)

    for (let r = 0; r < rows; r++) {
      gl.uniform3fv(uColor, colors[r])
      gl.drawArrays(gl.LINE_STRIP, r * history, history)
    }
  }

  return {
    resize,
    configure,
    update,
    render,
    sampler: (row: number) => samplers[row],
    samplerCount: samplers.length,
  }
}

const VERT = /* glsl */ `#version 300 es
precision highp float;

layout(location=0) in float a_x;
layout(location=1) in float a_row;
layout(location=2) in float a_value;

uniform float u_history;
uniform float u_width;
uniform float u_height;
uniform float u_padding;
uniform float u_rowH;

void main() {
  float x = u_padding + (a_x / (u_history - 1.0)) * (u_width - 2.0 * u_padding);
  float yBase = u_padding + a_row * (u_rowH + u_padding);
  float y = yBase + u_rowH - 2.0 - a_value * (u_rowH - 4.0);

  float ndcX = (x / u_width) * 2.0 - 1.0;
  float ndcY = 1.0 - (y / u_height) * 2.0;

  gl_Position = vec4(ndcX, ndcY, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform vec3 u_color;
out vec4 outColor;
void main(){
  outColor = vec4(u_color,1.0);
}
`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(s)
  }
  return s
}

function createProgram(gl: WebGL2RenderingContext) {
  const prog = gl.createProgram()
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  return prog
}

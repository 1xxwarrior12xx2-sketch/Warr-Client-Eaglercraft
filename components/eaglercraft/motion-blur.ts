export class MotionBlur {
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private frameBuffer: WebGLFramebuffer | null = null
  private colorTexture: WebGLTexture | null = null
  private previousFrameTexture: WebGLTexture | null = null
  private blurProgram: WebGLProgram | null = null
  private enabled = false
  private intensity = 0.8

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas
    this.gl = gl
    this.initialize()
  }

  private initialize(): void {
    this.createFrameBuffer()
    this.createShaderProgram()
  }

  private createFrameBuffer(): void {
    const gl = this.gl

    // Create frame buffer
    this.frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

    // Create color texture
    this.colorTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTexture, 0)

    // Create previous frame texture
    this.previousFrameTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  private createShaderProgram(): void {
    const gl = this.gl

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_currentFrame;
      uniform sampler2D u_previousFrame;
      uniform float u_intensity;
      varying vec2 v_texCoord;
      
      void main() {
        vec4 current = texture2D(u_currentFrame, v_texCoord);
        vec4 previous = texture2D(u_previousFrame, v_texCoord);
        
        // Blend current frame with previous frame for motion blur effect
        gl_FragColor = mix(current, previous, u_intensity * 0.5);
      }
    `

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    this.blurProgram = gl.createProgram()
    if (!this.blurProgram) return

    gl.attachShader(this.blurProgram, vertexShader)
    gl.attachShader(this.blurProgram, fragmentShader)
    gl.linkProgram(this.blurProgram)

    if (!gl.getProgramParameter(this.blurProgram, gl.LINK_STATUS)) {
      console.error("Motion blur shader program failed to link:", gl.getProgramInfoLog(this.blurProgram))
      return
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  setIntensity(intensity: number): void {
    this.intensity = Math.max(0, Math.min(1, intensity))
  }

  beginFrame(): void {
    if (!this.enabled || !this.frameBuffer) return

    const gl = this.gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
  }

  endFrame(): void {
    const gl = this.gl

    // Bind default framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // Use blur shader program
    const blurProgram = this.blurProgram
    if (!blurProgram || !this.colorTexture || !this.previousFrameTexture) return
    gl.useProgram(blurProgram)

    // Set up uniforms
    const currentFrameLocation = gl.getUniformLocation(blurProgram, "u_currentFrame")
    const previousFrameLocation = gl.getUniformLocation(blurProgram, "u_previousFrame")
    const intensityLocation = gl.getUniformLocation(blurProgram, "u_intensity")

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture)
    gl.uniform1i(currentFrameLocation, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture)
    gl.uniform1i(previousFrameLocation, 1)

    gl.uniform1f(intensityLocation, this.intensity)

    // Render full-screen quad
    this.renderQuad()

    // Copy current frame to previous frame texture for next frame
    gl.bindTexture(gl.TEXTURE_2D, this.previousFrameTexture)
    gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.canvas.width, this.canvas.height, 0)
  }

  private renderQuad(): void {
    const gl = this.gl

    // Create quad vertices
    const vertices = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(this.blurProgram!, "a_position")
    const texCoordLocation = gl.getAttribLocation(this.blurProgram!, "a_texCoord")

    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0)

    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.deleteBuffer(buffer)
  }
}

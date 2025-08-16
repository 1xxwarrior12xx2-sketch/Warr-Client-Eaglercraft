import { TextureLoader } from "./texture-loader"
import { ReplaySystem } from "./replay-system"
import { PerformanceOptimizer } from "./performance-optimizer"
import { ChunkManager } from "./chunk-manager"

export class EaglercraftEngine {
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext | null = null
  private isRunning = false
  private lastFrameTime = 0
  private frameCount = 0
  private fps = 0
  private animationId: number | null = null

  private textureLoader: TextureLoader | null = null
  private replaySystem: ReplaySystem | null = null
  private performanceOptimizer: PerformanceOptimizer | null = null
  private chunkManager: ChunkManager | null = null
  private frameRateLimiter: number | null = null

  // Game state
  private world: any = null
  public player: any = null
  private camera: any = null

  // Settings
  public settings = {
    renderDistance: 8,
    fov: 70,
    mouseSensitivity: 1.0,
    motionBlur: false,
    vsync: true,
    texturePackUrl: "/textures/default.zip",
    showFPS: true,
    autoGG: true,
    keystrokeDisplay: true,
    recording: false,
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  async initialize(): Promise<void> {
    // Initialize WebGL context
    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl")

    if (!this.gl) {
      throw new Error("WebGL not supported")
    }

    // Set up WebGL state
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.BACK)
    this.gl.clearColor(0.5, 0.8, 1.0, 1.0) // Sky blue

    this.textureLoader = new TextureLoader(this.gl)
    this.replaySystem = new ReplaySystem(this)
    this.performanceOptimizer = new PerformanceOptimizer(this)
    this.chunkManager = new ChunkManager(this)

    // Apply initial optimizations
    this.performanceOptimizer.optimizeWebGL()
    this.performanceOptimizer.enableFrustumCulling()
    this.performanceOptimizer.optimizeTextureLoading()

    // Initialize game components
    await this.initializeWorld()
    await this.initializePlayer()
    await this.initializeCamera()
    await this.loadTexturePack()

    console.log("[Warr Client] Eaglercraft engine initialized successfully")
  }

  private async initializeWorld(): Promise<void> {
    // Initialize world generation and chunk loading
    this.world = {
      chunks: new Map(),
      loadedChunks: new Set(),
      seed: Math.floor(Math.random() * 1000000),
    }
  }

  private async initializePlayer(): Promise<void> {
    // Initialize player state
    this.player = {
      x: 0,
      y: 64,
      z: 0,
      yaw: 0,
      pitch: 0,
      health: 20,
      hunger: 20,
      inventory: new Array(36).fill(null),
    }
  }

  private async initializeCamera(): Promise<void> {
    // Initialize camera matrices
    this.camera = {
      viewMatrix: new Float32Array(16),
      projectionMatrix: new Float32Array(16),
      position: [0, 64, 0],
      rotation: [0, 0, 0],
    }
    this.updateProjectionMatrix()
  }

  private async loadTexturePack(): Promise<void> {
    if (this.textureLoader) {
      try {
        await this.textureLoader.loadTexturePack("default")
        console.log("[Warr Client] Default texture pack loaded successfully")
      } catch (error) {
        console.error("[Warr Client] Failed to load texture pack:", error)
      }
    }
  }

  async changeTexturePack(packId: string, packUrl?: string): Promise<void> {
    if (this.textureLoader) {
      try {
        await this.textureLoader.loadTexturePack(packId, packUrl)
        console.log(`[Warr Client] Changed to texture pack: ${packId}`)
      } catch (error) {
        console.error(`[Warr Client] Failed to change texture pack: ${packId}`, error)
        throw error
      }
    }
  }

  start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.lastFrameTime = performance.now()
    this.gameLoop()
    console.log("[Warr Client] Game started")
  }

  pause(): void {
    this.isRunning = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    console.log("[Warr Client] Game paused")
  }

  reset(): void {
    this.pause()
    // Reset game state
    this.initializePlayer()
    this.initializeWorld()
    console.log("[Warr Client] Game reset")
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return

    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastFrameTime

    if (this.settings.vsync && deltaTime < 16.67) {
      // 60 FPS limit
      this.animationId = requestAnimationFrame(this.gameLoop)
      return
    }

    this.lastFrameTime = currentTime

    if (this.performanceOptimizer) {
      this.performanceOptimizer.recordFrameTime(deltaTime)
    }

    // Update FPS counter
    this.frameCount++
    if (this.frameCount >= 60) {
      this.fps = Math.round(1000 / (deltaTime || 1))
      this.frameCount = 0
    }

    // Update game logic
    this.update(deltaTime)

    // Render frame
    this.render()

    // Continue loop
    this.animationId = requestAnimationFrame(this.gameLoop)
  }

  private update(deltaTime: number): void {
    // Update player position, world chunks, etc.
    if (this.player && this.camera) {
      this.camera.position = [this.player.x, this.player.y + 1.8, this.player.z]
    }

    if (this.chunkManager && this.player) {
      this.chunkManager.updateChunks(this.player.x, this.player.z)
    }

    if (this.replaySystem) {
      this.replaySystem.update()
    }
  }

  private render(): void {
    if (!this.gl) return

    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // Render world chunks
    this.renderWorld()

    // Render UI elements
    this.renderUI()
  }

  private renderWorld(): void {
    // World rendering implementation
    // This would include chunk rendering, entity rendering, etc.
  }

  private renderUI(): void {
    // UI rendering (crosshair, HUD, etc.)
  }

  getFPS(): number {
    return this.fps
  }

  updateSetting(key: string, value: any): void {
    if (key in this.settings) {
      ;(this.settings as any)[key] = value

      // Handle specific setting changes
      if (key === "fov" || key === "renderDistance") {
        this.updateProjectionMatrix()
      }

      console.log(`[Warr Client] Setting updated: ${key} = ${value}`)
    }
  }

  getTextureLoader(): TextureLoader | null {
    return this.textureLoader
  }

  getReplaySystem(): ReplaySystem | null {
    return this.replaySystem
  }

  startRecording(name?: string): void {
    if (this.replaySystem) {
      this.replaySystem.startRecording(name || `Recording ${new Date().toLocaleString()}`)
      this.settings.recording = true
    }
  }

  stopRecording(): any {
    if (this.replaySystem) {
      const replayData = this.replaySystem.stopRecording()
      this.settings.recording = false
      return replayData
    }
    return null
  }

  isRecording(): boolean {
    return this.replaySystem?.isCurrentlyRecording() || false
  }

  private updateProjectionMatrix(): void {
    if (!this.gl) return

    const aspect = this.canvas.width / this.canvas.height
    const fov = (this.settings.fov * Math.PI) / 180
    const near = 0.1
    const far = this.settings.renderDistance * 16

    // Create perspective projection matrix
    const f = 1.0 / Math.tan(fov / 2)
    this.camera.projectionMatrix[0] = f / aspect
    this.camera.projectionMatrix[5] = f
    this.camera.projectionMatrix[10] = (far + near) / (near - far)
    this.camera.projectionMatrix[11] = -1
    this.camera.projectionMatrix[14] = (2 * far * near) / (near - far)
  }

  // Performance optimization methods
  getPerformanceOptimizer(): PerformanceOptimizer | null {
    return this.performanceOptimizer
  }

  getChunkManager(): ChunkManager | null {
    return this.chunkManager
  }

  setFrameRateLimit(fps: number): void {
    if (this.performanceOptimizer) {
      this.performanceOptimizer.setTargetFPS(fps)
    }
  }

  enableAdaptiveQuality(enabled: boolean): void {
    if (this.performanceOptimizer) {
      this.performanceOptimizer.setAdaptiveQuality(enabled)
    }
  }

  getPerformanceMetrics(): any {
    return this.performanceOptimizer?.getPerformanceMetrics() || {}
  }
}

export class PerformanceOptimizer {
  private engine: any
  private frameTimeHistory: number[] = []
  private lastGCTime = 0
  private gcInterval = 30000 // 30 seconds
  private targetFPS = 60
  private adaptiveQuality = true
  private performanceMetrics = {
    avgFrameTime: 0,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  }

  constructor(engine: any) {
    this.engine = engine
    this.setupPerformanceMonitoring()
  }

  private setupPerformanceMonitoring(): void {
    // Monitor performance metrics
    setInterval(() => {
      this.updatePerformanceMetrics()
      this.optimizeBasedOnPerformance()
      this.manageMemory()
    }, 1000)
  }

  private updatePerformanceMetrics(): void {
    // Calculate average frame time
    if (this.frameTimeHistory.length > 0) {
      this.performanceMetrics.avgFrameTime =
        this.frameTimeHistory.reduce((a, b) => a + b) / this.frameTimeHistory.length
    }

    // Estimate memory usage (simplified)
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024 // MB
    }

    // Clear old frame time data
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory = this.frameTimeHistory.slice(-30)
    }
  }

  recordFrameTime(deltaTime: number): void {
    this.frameTimeHistory.push(deltaTime)
  }

  private optimizeBasedOnPerformance(): void {
    if (!this.adaptiveQuality) return

    const currentFPS = 1000 / this.performanceMetrics.avgFrameTime
    const settings = this.engine.settings

    // Adaptive quality based on FPS
    if (currentFPS < this.targetFPS * 0.8) {
      // Performance is poor, reduce quality
      if (settings.renderDistance > 4) {
        this.engine.updateSetting("renderDistance", Math.max(4, settings.renderDistance - 1))
        console.log("[Performance] Reduced render distance to improve FPS")
      }

      if (settings.motionBlur) {
        this.engine.updateSetting("motionBlur", false)
        console.log("[Performance] Disabled motion blur to improve FPS")
      }
    } else if (currentFPS > this.targetFPS * 1.1) {
      // Performance is good, can increase quality
      if (settings.renderDistance < 16) {
        this.engine.updateSetting("renderDistance", Math.min(16, settings.renderDistance + 1))
        console.log("[Performance] Increased render distance")
      }
    }
  }

  private manageMemory(): void {
    const now = Date.now()
    if (now - this.lastGCTime > this.gcInterval) {
      this.performGarbageCollection()
      this.lastGCTime = now
    }
  }

  private performGarbageCollection(): void {
    // Clear unused textures
    if (this.engine.textureLoader) {
      this.engine.textureLoader.cleanupUnusedTextures()
    }

    // Clear old chunks
    if (this.engine.world) {
      this.cleanupDistantChunks()
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }

    console.log("[Performance] Performed memory cleanup")
  }

  private cleanupDistantChunks(): void {
    const playerPos = this.engine.player
    if (!playerPos) return

    const maxDistance = this.engine.settings.renderDistance * 16
    const chunksToRemove: string[] = []

    this.engine.world.chunks.forEach((chunk: any, key: string) => {
      const [chunkX, chunkZ] = key.split(",").map(Number)
      const distance = Math.sqrt(Math.pow(chunkX * 16 - playerPos.x, 2) + Math.pow(chunkZ * 16 - playerPos.z, 2))

      if (distance > maxDistance * 1.5) {
        chunksToRemove.push(key)
      }
    })

    chunksToRemove.forEach((key) => {
      this.engine.world.chunks.delete(key)
      this.engine.world.loadedChunks.delete(key)
    })

    if (chunksToRemove.length > 0) {
      console.log(`[Performance] Cleaned up ${chunksToRemove.length} distant chunks`)
    }
  }

  optimizeWebGL(): void {
    const gl = this.engine.gl
    if (!gl) return

    // Enable WebGL optimizations
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.frontFace(gl.CCW)

    // Optimize depth testing
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    // Enable blending optimizations
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Set optimal viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    console.log("[Performance] Applied WebGL optimizations")
  }

  enableFrustumCulling(): void {
    // Implement frustum culling for better performance
    this.engine.frustumCulling = true
    console.log("[Performance] Enabled frustum culling")
  }

  optimizeTextureLoading(): void {
    if (this.engine.textureLoader) {
      this.engine.textureLoader.enableCompression()
      this.engine.textureLoader.enableMipmapping()
      this.engine.textureLoader.setMaxTextureSize(1024)
      console.log("[Performance] Optimized texture loading")
    }
  }

  setTargetFPS(fps: number): void {
    this.targetFPS = Math.max(30, Math.min(144, fps))
  }

  setAdaptiveQuality(enabled: boolean): void {
    this.adaptiveQuality = enabled
  }

  getPerformanceMetrics(): any {
    return { ...this.performanceMetrics }
  }
}

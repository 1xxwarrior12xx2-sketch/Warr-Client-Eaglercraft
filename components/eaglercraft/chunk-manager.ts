export class ChunkManager {
  private engine: any
  private loadedChunks = new Map<string, any>()
  private chunkLoadQueue: string[] = []
  private maxConcurrentLoads = 4
  private currentLoads = 0
  private chunkCache = new Map<string, any>()
  private maxCacheSize = 100

  constructor(engine: any) {
    this.engine = engine
  }

  updateChunks(playerX: number, playerZ: number): void {
    const chunkX = Math.floor(playerX / 16)
    const chunkZ = Math.floor(playerZ / 16)
    const renderDistance = this.engine.settings.renderDistance

    // Determine which chunks should be loaded
    const requiredChunks = new Set<string>()
    for (let x = chunkX - renderDistance; x <= chunkX + renderDistance; x++) {
      for (let z = chunkZ - renderDistance; z <= chunkZ + renderDistance; z++) {
        const distance = Math.sqrt((x - chunkX) ** 2 + (z - chunkZ) ** 2)
        if (distance <= renderDistance) {
          requiredChunks.add(`${x},${z}`)
        }
      }
    }

    // Queue chunks for loading
    requiredChunks.forEach((chunkKey) => {
      if (!this.loadedChunks.has(chunkKey) && !this.chunkLoadQueue.includes(chunkKey)) {
        this.chunkLoadQueue.push(chunkKey)
      }
    })

    // Unload distant chunks
    this.unloadDistantChunks(chunkX, chunkZ, renderDistance)

    // Process chunk loading queue
    this.processChunkQueue()
  }

  private processChunkQueue(): void {
    while (this.chunkLoadQueue.length > 0 && this.currentLoads < this.maxConcurrentLoads) {
      const chunkKey = this.chunkLoadQueue.shift()!
      this.loadChunk(chunkKey)
    }
  }

  private async loadChunk(chunkKey: string): Promise<void> {
    this.currentLoads++

    try {
      // Check cache first
      if (this.chunkCache.has(chunkKey)) {
        const cachedChunk = this.chunkCache.get(chunkKey)
        this.loadedChunks.set(chunkKey, cachedChunk)
        console.log(`[ChunkManager] Loaded chunk ${chunkKey} from cache`)
        return
      }

      // Generate or load chunk data
      const [x, z] = chunkKey.split(",").map(Number)
      const chunkData = await this.generateChunk(x, z)

      this.loadedChunks.set(chunkKey, chunkData)

      // Add to cache
      this.addToCache(chunkKey, chunkData)

      console.log(`[ChunkManager] Loaded chunk ${chunkKey}`)
    } catch (error) {
      console.error(`[ChunkManager] Failed to load chunk ${chunkKey}:`, error)
    } finally {
      this.currentLoads--
    }
  }

  private async generateChunk(x: number, z: number): Promise<any> {
    // Simulate chunk generation (in real implementation, this would generate terrain)
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve({
            x,
            z,
            blocks: new Array(16 * 16 * 256).fill(0), // Simplified block data
            entities: [],
            generated: true,
          })
        },
        Math.random() * 100 + 50,
      ) // Simulate generation time
    })
  }

  private unloadDistantChunks(playerChunkX: number, playerChunkZ: number, renderDistance: number): void {
    const chunksToUnload: string[] = []

    this.loadedChunks.forEach((chunk, chunkKey) => {
      const [x, z] = chunkKey.split(",").map(Number)
      const distance = Math.sqrt((x - playerChunkX) ** 2 + (z - playerChunkZ) ** 2)

      if (distance > renderDistance * 1.2) {
        chunksToUnload.push(chunkKey)
      }
    })

    chunksToUnload.forEach((chunkKey) => {
      const chunk = this.loadedChunks.get(chunkKey)
      this.loadedChunks.delete(chunkKey)

      // Move to cache instead of completely unloading
      this.addToCache(chunkKey, chunk)
    })

    if (chunksToUnload.length > 0) {
      console.log(`[ChunkManager] Unloaded ${chunksToUnload.length} distant chunks`)
    }
  }

  private addToCache(chunkKey: string, chunkData: any): void {
    // Remove oldest entries if cache is full
    if (this.chunkCache.size >= this.maxCacheSize) {
      const firstKey = this.chunkCache.keys().next().value
      this.chunkCache.delete(firstKey)
    }

    this.chunkCache.set(chunkKey, chunkData)
  }

  getLoadedChunks(): Map<string, any> {
    return this.loadedChunks
  }

  getChunkLoadProgress(): number {
    const totalRequired = this.loadedChunks.size + this.chunkLoadQueue.length
    if (totalRequired === 0) return 100
    return (this.loadedChunks.size / totalRequired) * 100
  }
}

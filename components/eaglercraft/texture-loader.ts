export class TextureLoader {
  private gl: WebGLRenderingContext
  private textures: Map<string, WebGLTexture> = new Map()
  private currentPack = "default"
  private compressionEnabled = false
  private mipmappingEnabled = false
  private maxTextureSize = 1024
  private lastUsed: Map<string, number> = new Map()

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
  }

  async loadTexturePack(packId: string, packUrl?: string): Promise<void> {
    console.log(`[Warr Client] Loading texture pack: ${packId}`)

    try {
      // Load texture pack data
      const textureData = await this.fetchTexturePack(packId, packUrl)

      // Parse and load textures
      await this.parseTexturePack(textureData)

      this.currentPack = packId
      console.log(`[Warr Client] Successfully loaded texture pack: ${packId}`)
    } catch (error) {
      console.error(`[Warr Client] Failed to load texture pack: ${packId}`, error)
      throw error
    }
  }

  private async fetchTexturePack(packId: string, packUrl?: string): Promise<ArrayBuffer> {
    if (packUrl) {
      const response = await fetch(packUrl)
      return response.arrayBuffer()
    }

    // Load default texture packs
    const defaultPacks: Record<string, string> = {
      default: "/textures/default.zip",
      faithful: "/textures/faithful-32x.zip",
      sphax: "/textures/sphax-64x.zip",
      dokucraft: "/textures/dokucraft-32x.zip",
      "john-smith": "/textures/johnsmith-32x.zip",
      soartex: "/textures/soartex-64x.zip",
    }

    const url = defaultPacks[packId]
    if (!url) {
      throw new Error(`Unknown texture pack: ${packId}`)
    }

    const response = await fetch(url)
    return response.arrayBuffer()
  }

  private async parseTexturePack(data: ArrayBuffer): Promise<void> {
    // Parse ZIP file and extract textures
    // This would use a ZIP library like JSZip in a real implementation

    // For now, simulate texture loading
    const textureNames = [
      "blocks/stone",
      "blocks/dirt",
      "blocks/grass_top",
      "blocks/grass_side",
      "blocks/wood",
      "blocks/leaves",
      "blocks/water",
      "blocks/lava",
      "items/sword_iron",
      "items/pickaxe_iron",
      "items/apple",
      "entity/player",
    ]

    for (const textureName of textureNames) {
      await this.loadTexture(textureName)
    }
  }

  private async loadTexture(name: string): Promise<WebGLTexture> {
    if (this.textures.has(name)) {
      return this.textures.get(name)!
    }

    const texture = this.gl.createTexture()
    if (!texture) {
      throw new Error(`Failed to create texture: ${name}`)
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    // Create a placeholder texture while loading
    const placeholderData = new Uint8Array([255, 0, 255, 255]) // Magenta
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      placeholderData,
    )

    // Load actual texture
    const image = new Image()
    image.crossOrigin = "anonymous"

    return new Promise((resolve, reject) => {
      image.onload = () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        const optimizedImage = this.optimizeTexture(image)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, optimizedImage)

        // Set texture parameters
        if (this.mipmappingEnabled) {
          this.gl.generateMipmap(this.gl.TEXTURE_2D)
        }
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)

        this.textures.set(name, texture)
        resolve(texture)
      }

      image.onerror = () => {
        reject(new Error(`Failed to load texture: ${name}`))
      }

      // Use placeholder image URL for now
      image.src = `/placeholder.svg?height=16&width=16&query=${name.replace("/", " ")}`
    })
  }

  getTexture(name: string): WebGLTexture | null {
    const texture = this.textures.get(name) || null
    if (texture) {
      this.lastUsed.set(name, Date.now())
    }
    return texture
  }

  getCurrentPack(): string {
    return this.currentPack
  }

  enableCompression(): void {
    this.compressionEnabled = true
    console.log("[TextureLoader] Enabled texture compression")
  }

  enableMipmapping(): void {
    this.mipmappingEnabled = true
    console.log("[TextureLoader] Enabled mipmapping")
  }

  setMaxTextureSize(size: number): void {
    this.maxTextureSize = size
    console.log(`[TextureLoader] Set max texture size to ${size}x${size}`)
  }

  cleanupUnusedTextures(): void {
    const now = Date.now()
    const maxAge = 60000 // 1 minute
    const texturesToRemove: string[] = []

    this.lastUsed.forEach((lastUsedTime, textureName) => {
      if (now - lastUsedTime > maxAge) {
        texturesToRemove.push(textureName)
      }
    })

    texturesToRemove.forEach((textureName) => {
      const texture = this.textures.get(textureName)
      if (texture) {
        this.gl.deleteTexture(texture)
        this.textures.delete(textureName)
        this.lastUsed.delete(textureName)
      }
    })

    if (texturesToRemove.length > 0) {
      console.log(`[TextureLoader] Cleaned up ${texturesToRemove.length} unused textures`)
    }
  }

  private optimizeTexture(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Resize if too large
    let { width, height } = image
    if (width > this.maxTextureSize || height > this.maxTextureSize) {
      const scale = Math.min(this.maxTextureSize / width, this.maxTextureSize / height)
      width *= scale
      height *= scale
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(image, 0, 0, width, height)

    return canvas
  }

  async createTextureAtlas(): Promise<WebGLTexture> {
    // Create a texture atlas for efficient rendering
    const atlasSize = 512
    const canvas = document.createElement("canvas")
    canvas.width = atlasSize
    canvas.height = atlasSize
    const ctx = canvas.getContext("2d")!

    // Draw all textures into the atlas
    // This would be implemented based on the loaded textures

    const texture = this.gl.createTexture()!
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas)

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)

    return texture
  }

  dispose(): void {
    for (const texture of this.textures.values()) {
      this.gl.deleteTexture(texture)
    }
    this.textures.clear()
  }
}

export interface ReplayFrame {
  timestamp: number
  playerPosition: { x: number; y: number; z: number }
  playerRotation: { yaw: number; pitch: number }
  worldState: any
  events: ReplayEvent[]
}

export interface ReplayEvent {
  type: "chat" | "block_break" | "block_place" | "damage" | "death" | "respawn"
  timestamp: number
  data: any
}

export interface ReplayData {
  id: string
  name: string
  startTime: Date
  duration: number
  frames: ReplayFrame[]
  metadata: {
    version: string
    worldSeed: number
    gamemode: string
    difficulty: string
  }
}

export class ReplaySystem {
  private isRecording = false
  private isPlaying = false
  private currentReplay: ReplayData | null = null
  private recordingFrames: ReplayFrame[] = []
  private recordingStartTime = 0
  private playbackStartTime = 0
  private playbackSpeed = 1
  private currentFrame = 0

  constructor(private engine: any) {}

  startRecording(name: string): void {
    if (this.isRecording) return

    this.isRecording = true
    this.recordingFrames = []
    this.recordingStartTime = performance.now()

    console.log(`[Warr Client] Started recording: ${name}`)
  }

  stopRecording(): ReplayData | null {
    if (!this.isRecording) return null

    this.isRecording = false
    const duration = performance.now() - this.recordingStartTime

    const replayData: ReplayData = {
      id: Date.now().toString(),
      name: `Recording ${new Date().toLocaleString()}`,
      startTime: new Date(),
      duration: Math.floor(duration / 1000),
      frames: [...this.recordingFrames],
      metadata: {
        version: "1.12",
        worldSeed: this.engine.world?.seed || 0,
        gamemode: "survival",
        difficulty: "normal",
      },
    }

    this.recordingFrames = []
    console.log(
      `[Warr Client] Stopped recording. Duration: ${replayData.duration}s, Frames: ${replayData.frames.length}`,
    )

    return replayData
  }

  recordFrame(): void {
    if (!this.isRecording || !this.engine.player) return

    const timestamp = performance.now() - this.recordingStartTime

    const frame: ReplayFrame = {
      timestamp,
      playerPosition: {
        x: this.engine.player.x,
        y: this.engine.player.y,
        z: this.engine.player.z,
      },
      playerRotation: {
        yaw: this.engine.player.yaw,
        pitch: this.engine.player.pitch,
      },
      worldState: this.captureWorldState(),
      events: [],
    }

    this.recordingFrames.push(frame)
  }

  private captureWorldState(): any {
    // Capture relevant world state for replay
    return {
      loadedChunks: Array.from(this.engine.world?.loadedChunks || []),
      entities: [], // Would capture entities in the area
      blockChanges: [], // Would capture block changes since last frame
    }
  }

  loadReplay(replayData: ReplayData): void {
    this.currentReplay = replayData
    this.currentFrame = 0
    console.log(`[Warr Client] Loaded replay: ${replayData.name}`)
  }

  startPlayback(): void {
    if (!this.currentReplay || this.isPlaying) return

    this.isPlaying = true
    this.playbackStartTime = performance.now()
    this.currentFrame = 0

    console.log(`[Warr Client] Started replay playback: ${this.currentReplay.name}`)
  }

  pausePlayback(): void {
    this.isPlaying = false
    console.log("[Warr Client] Paused replay playback")
  }

  stopPlayback(): void {
    this.isPlaying = false
    this.currentFrame = 0
    console.log("[Warr Client] Stopped replay playback")
  }

  seekToTime(timeSeconds: number): void {
    if (!this.currentReplay) return

    const targetTimestamp = timeSeconds * 1000
    this.currentFrame = this.currentReplay.frames.findIndex((frame) => frame.timestamp >= targetTimestamp)

    if (this.currentFrame === -1) {
      this.currentFrame = this.currentReplay.frames.length - 1
    }

    this.applyFrame(this.currentReplay.frames[this.currentFrame])
    console.log(`[Warr Client] Seeked to ${timeSeconds}s (frame ${this.currentFrame})`)
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(4, speed))
    console.log(`[Warr Client] Set playback speed to ${this.playbackSpeed}x`)
  }

  update(): void {
    if (this.isRecording) {
      this.recordFrame()
    }

    if (this.isPlaying && this.currentReplay) {
      this.updatePlayback()
    }
  }

  private updatePlayback(): void {
    if (!this.currentReplay || !this.isPlaying) return

    const elapsed = (performance.now() - this.playbackStartTime) * this.playbackSpeed
    const targetFrame = this.currentReplay.frames.findIndex((frame) => frame.timestamp >= elapsed)

    if (targetFrame !== -1 && targetFrame !== this.currentFrame) {
      this.currentFrame = targetFrame
      this.applyFrame(this.currentReplay.frames[this.currentFrame])
    }

    // Check if replay finished
    if (this.currentFrame >= this.currentReplay.frames.length - 1) {
      this.stopPlayback()
    }
  }

  private applyFrame(frame: ReplayFrame): void {
    if (!this.engine.player) return

    // Apply player position and rotation
    this.engine.player.x = frame.playerPosition.x
    this.engine.player.y = frame.playerPosition.y
    this.engine.player.z = frame.playerPosition.z
    this.engine.player.yaw = frame.playerRotation.yaw
    this.engine.player.pitch = frame.playerRotation.pitch

    // Apply world state changes
    this.applyWorldState(frame.worldState)

    // Process events
    frame.events.forEach((event) => this.processReplayEvent(event))
  }

  private applyWorldState(worldState: any): void {
    // Apply world state changes from the frame
    // This would update chunks, entities, etc.
  }

  private processReplayEvent(event: ReplayEvent): void {
    switch (event.type) {
      case "chat":
        console.log(`[Replay Chat] ${event.data.message}`)
        break
      case "block_break":
        console.log(`[Replay] Block broken at ${event.data.x}, ${event.data.y}, ${event.data.z}`)
        break
      case "block_place":
        console.log(`[Replay] Block placed at ${event.data.x}, ${event.data.y}, ${event.data.z}`)
        break
      case "damage":
        console.log(`[Replay] Player took ${event.data.amount} damage`)
        break
    }
  }

  exportReplay(replayData: ReplayData, format: "json" | "mp4" = "json"): Blob {
    if (format === "json") {
      const jsonData = JSON.stringify(replayData, null, 2)
      return new Blob([jsonData], { type: "application/json" })
    } else {
      // For MP4 export, we would need to render frames to video
      // This is a complex process that would require a video encoder
      throw new Error("MP4 export not implemented yet")
    }
  }

  importReplay(file: File): Promise<ReplayData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const replayData = JSON.parse(e.target?.result as string)
          resolve(replayData)
        } catch (error) {
          reject(new Error("Invalid replay file format"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  getCurrentTime(): number {
    if (!this.currentReplay || !this.isPlaying) return 0
    return ((performance.now() - this.playbackStartTime) * this.playbackSpeed) / 1000
  }

  getTotalDuration(): number {
    return this.currentReplay?.duration || 0
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }
}

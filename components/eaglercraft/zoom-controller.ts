export class ZoomController {
  private engine: any
  private originalFOV: number
  private zoomFOV = 30
  private isZooming = false
  private zoomKey = "KeyC"
  private smoothZoom = true
  private zoomSpeed = 0.1

  constructor(engine: any) {
    this.engine = engine
    this.originalFOV = engine.settings.fov
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this))
    document.addEventListener("keyup", this.handleKeyUp.bind(this))
    document.addEventListener("wheel", this.handleWheel.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.code === this.zoomKey && !this.isZooming) {
      this.startZoom()
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (event.code === this.zoomKey && this.isZooming) {
      this.stopZoom()
    }
  }

  private handleWheel(event: WheelEvent): void {
    if (this.isZooming) {
      event.preventDefault()

      // Adjust zoom level with mouse wheel
      const delta = event.deltaY > 0 ? 5 : -5
      this.zoomFOV = Math.max(10, Math.min(60, this.zoomFOV + delta))

      if (this.smoothZoom) {
        this.smoothTransitionToFOV(this.zoomFOV)
      } else {
        this.engine.updateSetting("fov", this.zoomFOV)
      }
    }
  }

  private startZoom(): void {
    this.isZooming = true

    if (this.smoothZoom) {
      this.smoothTransitionToFOV(this.zoomFOV)
    } else {
      this.engine.updateSetting("fov", this.zoomFOV)
    }

    console.log("[Zoom] Zoom activated")
  }

  private stopZoom(): void {
    this.isZooming = false

    if (this.smoothZoom) {
      this.smoothTransitionToFOV(this.originalFOV)
    } else {
      this.engine.updateSetting("fov", this.originalFOV)
    }

    console.log("[Zoom] Zoom deactivated")
  }

  private smoothTransitionToFOV(targetFOV: number): void {
    const currentFOV = this.engine.settings.fov
    const difference = targetFOV - currentFOV

    if (Math.abs(difference) < 0.5) {
      this.engine.updateSetting("fov", targetFOV)
      return
    }

    const newFOV = currentFOV + difference * this.zoomSpeed
    this.engine.updateSetting("fov", newFOV)

    requestAnimationFrame(() => this.smoothTransitionToFOV(targetFOV))
  }

  setZoomFOV(fov: number): void {
    this.zoomFOV = Math.max(10, Math.min(60, fov))
  }

  setZoomKey(key: string): void {
    this.zoomKey = key
  }

  setSmoothZoom(enabled: boolean): void {
    this.smoothZoom = enabled
  }

  setZoomSpeed(speed: number): void {
    this.zoomSpeed = Math.max(0.01, Math.min(1, speed))
  }

  isCurrentlyZooming(): boolean {
    return this.isZooming
  }
}

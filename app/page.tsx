"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, Play, Video, Gamepad2, Globe, Users, Volume2, Mouse } from "lucide-react"

interface MinecraftSettings {
  // Video Settings
  renderDistance: number
  fov: number
  brightness: number
  particles: string
  vsync: boolean
  maxFramerate: number
  guiScale: number
  fullscreen: boolean

  // Audio Settings
  masterVolume: number
  musicVolume: number
  soundVolume: number
  ambientVolume: number

  // Controls
  mouseSensitivity: number
  invertMouse: boolean
  autoJump: boolean
  toggleCrouch: boolean
  toggleSprint: boolean

  // Client Features (separate from hacks)
  showFPS: boolean
  showKeystrokes: boolean
  autoGG: boolean
  showMinimap: boolean
  showCoords: boolean
  customCrosshair: boolean
  showCPS: boolean
  zoomEnabled: boolean

  // Hidden hack settings
  flyMode: boolean
  speedBoost: boolean
  xrayVision: boolean
  fullbright: boolean
  noClip: boolean
  infiniteReach: boolean
  autoAim: boolean
  wallHack: boolean
  godMode: boolean
}

interface KeystrokeState {
  w: boolean
  a: boolean
  s: boolean
  d: boolean
  space: boolean
  shift: boolean
  lmb: boolean
  rmb: boolean
}

interface Server {
  name: string
  ip: string
  wsUrl: string // WebSocket URL for Eaglercraft connection
  players: string
  ping: number
  version: string
  online: boolean
  eaglercraftCompatible: boolean
}

export default function WarrClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const homeCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHomeScreen, setShowHomeScreen] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState("video") // Added settings tabs
  const [hackPassword, setHackPassword] = useState("")
  const [hacksUnlocked, setHacksUnlocked] = useState(false)
  const [showServers, setShowServers] = useState(false)
  const [connectedServer, setConnectedServer] = useState<string | null>(null)
  const [fps, setFps] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [motionBlurFrames, setMotionBlurFrames] = useState<ImageData[]>([])
  const [keystrokes, setKeystrokes] = useState<KeystrokeState>({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    lmb: false,
    rmb: false,
  })
  const [cps, setCps] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [playerPos, setPlayerPos] = useState({ x: 128, y: 64, z: 256 })
  const [zoomLevel, setZoomLevel] = useState(1)
  const [entities, setEntities] = useState([
    { id: 1, x: 130, z: 260, type: "player", name: "Enemy1" },
    { id: 2, x: 125, z: 250, type: "mob", name: "Zombie" },
    { id: 3, x: 135, z: 270, type: "item", name: "Diamond" },
  ])

  const [settings, setSettings] = useState<MinecraftSettings>({
    // Video Settings
    renderDistance: 8,
    fov: 90,
    brightness: 50,
    particles: "All",
    vsync: true,
    maxFramerate: 120,
    guiScale: 2,
    fullscreen: false,

    // Audio Settings
    masterVolume: 100,
    musicVolume: 100,
    soundVolume: 100,
    ambientVolume: 100,

    // Controls
    mouseSensitivity: 100,
    invertMouse: false,
    autoJump: false,
    toggleCrouch: false,
    toggleSprint: false,

    // Client Features
    showFPS: true,
    showKeystrokes: true,
    autoGG: true,
    showMinimap: true,
    showCoords: true,
    customCrosshair: true,
    showCPS: true,
    zoomEnabled: true,

    // Hidden hack settings
    flyMode: false,
    speedBoost: false,
    xrayVision: false,
    fullbright: false,
    noClip: false,
    infiniteReach: false,
    autoAim: false,
    wallHack: false,
    godMode: false,
  })

  const [servers, setServers] = useState<Server[]>([
    {
      name: "Hypixel (Eaglercraft)",
      ip: "mc.hypixel.net",
      wsUrl: "wss://eaglercraft.hypixel.net/",
      players: "45,231/100,000",
      ping: 23,
      version: "1.8.9",
      online: true,
      eaglercraftCompatible: true,
    },
    {
      name: "Mineplex (Eaglercraft)",
      ip: "us.mineplex.com",
      wsUrl: "wss://eaglercraft.mineplex.com/",
      players: "8,432/20,000",
      ping: 45,
      version: "1.8.9",
      online: true,
      eaglercraftCompatible: true,
    },
    {
      name: "EaglercraftX Server",
      ip: "eaglercraftx.example.com",
      wsUrl: "wss://eaglercraftx.example.com:8080/",
      players: "234/500",
      ping: 67,
      version: "1.8.9",
      online: true,
      eaglercraftCompatible: true,
    },
    {
      name: "Local EaglercraftX",
      ip: "localhost:25565",
      wsUrl: "wss://localhost:8080/",
      players: "1/20",
      ping: 5,
      version: "1.8.9",
      online: false,
      eaglercraftCompatible: true,
    },
  ])
  const [customServerIP, setCustomServerIP] = useState("")
  const [customServerWS, setCustomServerWS] = useState("")
  const [websocket, setWebsocket] = useState<WebSocket | null>(null)

  const [gl, setGl] = useState<any>(null)
  const [program, setProgram] = useState<any>(null)
  const [vertexBuffer, setVertexBuffer] = useState<any>(null)
  const [indexBuffer, setIndexBuffer] = useState<any>(null)

  const checkHackPassword = (password: string) => {
    if (password === "WarriorIsDaBest") {
      setHacksUnlocked(true)
      setHackPassword("")
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    if (showHomeScreen) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [showHomeScreen])

  useEffect(() => {
    if (!showHomeScreen || !homeCanvasRef.current) return

    const canvas = homeCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create 3D Minecraft-style background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87CEEB")
      gradient.addColorStop(1, "#98FB98")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw floating blocks with parallax effect
      for (let i = 0; i < 50; i++) {
        const x = ((i * 100 + Math.sin(time + i) * 50) % (canvas.width + 100)) - 50
        const y = ((i * 80 + Math.cos(time * 0.5 + i) * 30) % (canvas.height + 100)) - 50
        const size = 20 + Math.sin(time + i) * 5

        // Apply parallax based on mouse position
        const parallaxX = x + mousePos.x * ((i % 3) + 1) * 10
        const parallaxY = y + mousePos.y * ((i % 3) + 1) * 5

        // Draw block with 3D effect
        const blockColors = ["#8B4513", "#228B22", "#696969", "#4169E1", "#FF6347"]
        const color = blockColors[i % blockColors.length]

        ctx.fillStyle = color
        ctx.fillRect(parallaxX, parallaxY, size, size)

        // Add 3D shading
        ctx.fillStyle = "rgba(255,255,255,0.3)"
        ctx.fillRect(parallaxX, parallaxY, size, size / 4)
        ctx.fillRect(parallaxX, parallaxY, size / 4, size)

        ctx.fillStyle = "rgba(0,0,0,0.3)"
        ctx.fillRect(parallaxX, parallaxY + (size * 3) / 4, size, size / 4)
        ctx.fillRect(parallaxX + (size * 3) / 4, parallaxY, size / 4, size)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [showHomeScreen, mousePos])

  const applyMotionBlur = (ctx: CanvasRenderingContext2D) => {
    if (!settings.motionBlur) return

    const currentFrame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    setMotionBlurFrames((prev) => {
      const newFrames = [...prev, currentFrame].slice(-3) // Keep last 3 frames

      if (newFrames.length > 1) {
        const blendedData = new Uint8ClampedArray(currentFrame.data)

        for (let i = 0; i < blendedData.length; i += 4) {
          let r = 0,
            g = 0,
            b = 0,
            a = 0

          newFrames.forEach((frame, index) => {
            const weight = (index + 1) / newFrames.length
            r += frame.data[i] * weight
            g += frame.data[i + 1] * weight
            b += frame.data[i + 2] * weight
            a += frame.data[i + 3] * weight
          })

          blendedData[i] = r / newFrames.length
          blendedData[i + 1] = g / newFrames.length
          blendedData[i + 2] = b / newFrames.length
          blendedData[i + 3] = a / newFrames.length
        }

        const blendedFrame = new ImageData(blendedData, ctx.canvas.width, ctx.canvas.height)
        ctx.putImageData(blendedFrame, 0, 0)
      }

      return newFrames
    })
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const glContext = canvas.getContext("webgl2") || canvas.getContext("webgl")

      if (!glContext) {
        console.error("[Warr Client] WebGL not supported")
        return
      }

      setGl(glContext)

      glContext.clearColor(0.5, 0.8, 1.0, 1.0)
      glContext.enable(glContext.DEPTH_TEST)
      glContext.enable(glContext.CULL_FACE)

      const vertexShaderSource = `
        attribute vec3 position;
        attribute vec2 texCoord;
        attribute vec3 normal;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform vec3 lightDirection;
        
        varying vec2 vTexCoord;
        varying float vLighting;
        
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vTexCoord = texCoord;
          vLighting = max(dot(normal, lightDirection), 0.3);
        }
      `

      const fragmentShaderSource = `
        precision mediump float;
        
        varying vec2 vTexCoord;
        varying float vLighting;
        uniform vec3 blockColor;
        uniform bool xrayMode;
        uniform bool fullbrightMode;
        
        void main() {
          vec3 color = blockColor;
          if (fullbrightMode) {
            gl_FragColor = vec4(color, xrayMode ? 0.5 : 1.0);
          } else {
            gl_FragColor = vec4(color * vLighting, xrayMode ? 0.5 : 1.0);
          }
        }
      `

      const vertexShader = glContext.createShader(glContext.VERTEX_SHADER)!
      glContext.shaderSource(vertexShader, vertexShaderSource)
      glContext.compileShader(vertexShader)

      const fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER)!
      glContext.shaderSource(fragmentShader, fragmentShaderSource)
      glContext.compileShader(fragmentShader)

      const shaderProgram = glContext.createProgram()!
      glContext.attachShader(shaderProgram, vertexShader)
      glContext.attachShader(shaderProgram, fragmentShader)
      glContext.linkProgram(shaderProgram)

      setProgram(shaderProgram)

      const vertices = new Float32Array([
        // Front face
        -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 0.0,
        0.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Back face
        -0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, -1.0, -0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 0.0, -1.0, 0.5, 0.5, -0.5, 0.0, 1.0,
        0.0, 0.0, -1.0, 0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -1.0,
      ])

      const indices = new Uint16Array([
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
      ])

      const vertexBufferObject = glContext.createBuffer()
      glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferObject)
      glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW)

      setVertexBuffer(vertexBufferObject)

      const indexBufferObject = glContext.createBuffer()
      glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBufferObject)
      glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, indices, glContext.STATIC_DRAW)

      setIndexBuffer(indexBufferObject)

      setIsLoaded(true)

      if (isPlaying) {
        requestAnimationFrame(animate)
      }
    }
  }, [isPlaying, connectedServer, settings.xrayVision, settings.fullbright])

  useEffect(() => {
    const interval = setInterval(() => {
      setCps(clickCount)
      setClickCount(0)
    }, 1000)
    return () => clearInterval(interval)
  }, [clickCount])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (settings.zoomEnabled && e.ctrlKey) {
        e.preventDefault()
        setZoomLevel((prev) => Math.max(0.5, Math.min(5, prev + (e.deltaY > 0 ? -0.2 : 0.2))))
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [settings.zoomEnabled])

  const connectToServer = (server: Server) => {
    console.log(`[Warr Client] Connecting to ${server.name} via ${server.wsUrl}...`)

    try {
      // Close existing connection if any
      if (websocket) {
        websocket.close()
      }

      // Create new WebSocket connection for Eaglercraft
      const ws = new WebSocket(server.wsUrl)

      ws.onopen = () => {
        console.log(`[Warr Client] Connected to ${server.name}`)
        setConnectedServer(server.name)
        setIsPlaying(true)
        setShowServers(false)

        // Send Eaglercraft handshake
        const handshake = {
          type: "handshake",
          protocol: "eaglercraft",
          version: "1.8.9",
          username: "WarrClient_User",
        }
        ws.send(JSON.stringify(handshake))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log(`[Warr Client] Received:`, data)

          // Handle different packet types
          switch (data.type) {
            case "login_success":
              console.log("[Warr Client] Login successful")
              break
            case "world_data":
              console.log("[Warr Client] Received world data")
              break
            case "player_update":
              console.log("[Warr Client] Player update received")
              break
          }
        } catch (e) {
          console.log(`[Warr Client] Raw message:`, event.data)
        }
      }

      ws.onerror = (error) => {
        console.error(`[Warr Client] WebSocket error:`, error)
        alert(`Failed to connect to ${server.name}. Make sure the server supports Eaglercraft WebSocket connections.`)
      }

      ws.onclose = () => {
        console.log(`[Warr Client] Disconnected from ${server.name}`)
        setConnectedServer(null)
        setIsPlaying(false)
      }

      setWebsocket(ws)
    } catch (error) {
      console.error(`[Warr Client] Connection error:`, error)
      alert(`Failed to connect to ${server.name}`)
    }
  }

  const disconnectFromServer = () => {
    if (websocket) {
      websocket.close()
      setWebsocket(null)
    }
    console.log("[Warr Client] Disconnected from server")
    setConnectedServer(null)
    setIsPlaying(false)
  }

  const connectToCustomServer = () => {
    if (!customServerWS.startsWith("wss://") && !customServerWS.startsWith("ws://")) {
      alert("Please enter a valid WebSocket URL starting with wss:// or ws://")
      return
    }

    const customServer: Server = {
      name: customServerIP || "Custom Server",
      ip: customServerIP,
      wsUrl: customServerWS,
      players: "?/?",
      ping: 0,
      version: "1.8.9",
      online: true,
      eaglercraftCompatible: true,
    }

    connectToServer(customServer)
  }

  const handlePlay = () => {
    if (!connectedServer) {
      setShowServers(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setFps(0)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      console.log("[Warr Client] Started recording")
    } else {
      console.log("[Warr Client] Stopped recording")
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    setClickCount((prev) => prev + 1)
    setKeystrokes((prev) => ({
      ...prev,
      lmb: e.button === 0 ? true : prev.lmb,
      rmb: e.button === 2 ? true : prev.rmb,
    }))
  }

  const handleMouseUp = (e: MouseEvent) => {
    setKeystrokes((prev) => ({
      ...prev,
      lmb: e.button === 0 ? false : prev.lmb,
      rmb: e.button === 2 ? false : prev.rmb,
    }))
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    setKeystrokes((prev) => ({
      ...prev,
      w: key === "w" ? true : prev.w,
      a: key === "a" ? true : prev.a,
      s: key === "s" ? true : prev.s,
      d: key === "d" ? true : prev.d,
      space: key === " " ? true : prev.space,
      shift: key === "shift" ? true : prev.shift,
    }))
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    setKeystrokes((prev) => ({
      ...prev,
      w: key === "w" ? false : prev.w,
      a: key === "a" ? false : prev.a,
      s: key === "s" ? false : prev.s,
      d: key === "d" ? false : prev.d,
      space: key === " " ? false : prev.space,
      shift: key === "shift" ? false : prev.shift,
    }))
  }

  const animate = (currentTime: number) => {
    const webglContext = gl // renamed to avoid linter confusion with React hooks
    const shaderProgram = program
    const vertexBufferObject = vertexBuffer
    const indexBufferObject = indexBuffer

    if (!webglContext || !shaderProgram || !vertexBufferObject || !indexBufferObject) {
      return
    }

    let frameCount = 0
    let lastTime = 0
    const cameraX = 0,
      cameraY = 0,
      cameraZ = 5

    const deltaTime = currentTime - lastTime
    lastTime = currentTime
    frameCount++

    if (frameCount % 60 === 0) {
      setFps(Math.round(1000 / deltaTime))
    }

    webglContext.viewport(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    webglContext.clear(webglContext.COLOR_BUFFER_BIT | webglContext.DEPTH_BUFFER_BIT)

    const projectionMatrix = new Float32Array([1.5, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, -1.002, -1, 0, 0, -0.2002, 0])

    const time = currentTime * 0.001
    const modelViewMatrix = new Float32Array([
      Math.cos(time * 0.1),
      0,
      Math.sin(time * 0.1),
      0,
      0,
      1,
      0,
      0,
      -Math.sin(time * 0.1),
      0,
      Math.cos(time * 0.1),
      0,
      cameraX,
      cameraY,
      -cameraZ,
      1,
    ])

    const projectionLocation = webglContext.getUniformLocation(shaderProgram, "projectionMatrix")
    const modelViewLocation = webglContext.getUniformLocation(shaderProgram, "modelViewMatrix")
    const lightDirectionLocation = webglContext.getUniformLocation(shaderProgram, "lightDirection")
    const blockColorLocation = webglContext.getUniformLocation(shaderProgram, "blockColor")
    const xrayModeLocation = webglContext.getUniformLocation(shaderProgram, "xrayMode")
    const fullbrightModeLocation = webglContext.getUniformLocation(shaderProgram, "fullbrightMode")

    webglContext.uniformMatrix4fv(projectionLocation, false, projectionMatrix)
    webglContext.uniformMatrix4fv(modelViewLocation, false, modelViewMatrix)
    webglContext.uniform3f(lightDirectionLocation, 0.5, 1.0, 0.5)
    webglContext.uniform1i(xrayModeLocation, settings.xrayVision ? 1 : 0)
    webglContext.uniform1i(fullbrightModeLocation, settings.fullbright ? 1 : 0)

    if (settings.xrayVision) {
      webglContext.enable(webglContext.BLEND)
      webglContext.blendFunc(webglContext.SRC_ALPHA, webglContext.ONE_MINUS_SRC_ALPHA)
    } else {
      webglContext.disable(webglContext.BLEND)
    }

    const blockTypes = [
      [0.2, 0.8, 0.2], // Grass
      [0.6, 0.4, 0.2], // Dirt
      [0.5, 0.5, 0.5], // Stone
      [0.8, 0.8, 0.2], // Sand
    ]

    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        for (let y = -1; y <= 1; y++) {
          const blockType = blockTypes[Math.abs(x + z + y) % blockTypes.length]
          webglContext.uniform3f(blockColorLocation, blockType[0], blockType[1], blockType[2])

          const blockMatrix = new Float32Array([
            Math.cos(time * 0.1),
            0,
            Math.sin(time * 0.1),
            0,
            0,
            1,
            0,
            0,
            -Math.sin(time * 0.1),
            0,
            Math.cos(time * 0.1),
            0,
            x * 2 + cameraX,
            y * 2 + cameraY,
            z * 2 - cameraZ,
            1,
          ])
          webglContext.uniformMatrix4fv(modelViewLocation, false, blockMatrix)

          const positionLocation = webglContext.getAttribLocation(shaderProgram, "position")
          const texCoordLocation = webglContext.getAttribLocation(shaderProgram, "texCoord")
          const normalLocation = webglContext.getAttribLocation(shaderProgram, "normal")

          webglContext.bindBuffer(webglContext.ARRAY_BUFFER, vertexBufferObject)
          webglContext.enableVertexAttribArray(positionLocation)
          webglContext.vertexAttribPointer(positionLocation, 3, webglContext.FLOAT, false, 32, 0)
          webglContext.enableVertexAttribArray(texCoordLocation)
          webglContext.vertexAttribPointer(texCoordLocation, 2, webglContext.FLOAT, false, 32, 12)
          webglContext.enableVertexAttribArray(normalLocation)
          webglContext.vertexAttribPointer(normalLocation, 3, webglContext.FLOAT, false, 32, 20)

          webglContext.bindBuffer(webglContext.ELEMENT_ARRAY_BUFFER, indexBufferObject)
          webglContext.drawElements(webglContext.TRIANGLES, 36, webglContext.UNSIGNED_SHORT, 0)
        }
      }
    }

    if (isPlaying) {
      requestAnimationFrame(animate)
    }
  }

  const startGame = () => {
    setShowHomeScreen(false)
    setIsPlaying(true)
  }

  const backToHome = () => {
    setIsPlaying(false)
    setShowHomeScreen(true)
    setConnectedServer(null)
  }

  if (showHomeScreen) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <canvas ref={homeCanvasRef} className="absolute inset-0 w-full h-full opacity-30" />

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Warr Client</h1>
                  <p className="text-sm text-white/60">v1.8.9 - Web Edition</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/30 text-white/80 bg-white/10">
                Project of Warrior12 @Warrior12YT
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                  WARR CLIENT
                </h2>
                <p className="text-xl text-white/80 mb-2">The Ultimate Eaglercraft Experience</p>
                <p className="text-white/60">Play Minecraft 1.8.9 directly in your browser</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  onClick={() => setShowServers(true)}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Multiplayer
                </Button>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Singleplayer
                </Button>

                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Options
                </Button>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-200">
                  <Video className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Enhanced Graphics</h3>
                  <p className="text-white/70 text-sm">Motion blur, custom shaders, and optimized rendering</p>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-200">
                  <Users className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Multiplayer Ready</h3>
                  <p className="text-white/70 text-sm">Connect to any Eaglercraft server instantly</p>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-200">
                  <Gamepad2 className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Client Features</h3>
                  <p className="text-white/70 text-sm">Keystrokes, minimap, FPS counter, and more</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="p-6 text-center">
            <p className="text-white/50 text-sm">Powered by Eaglercraft • No downloads required • Play anywhere</p>
          </footer>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-slate-800 border-slate-700 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex h-full">
                {/* Settings Sidebar */}
                <div className="w-48 bg-slate-900 border-r border-slate-700 p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Options</h3>
                  <div className="space-y-2">
                    {[
                      { id: "video", label: "Video Settings", icon: Video },
                      { id: "audio", label: "Music & Sounds", icon: Volume2 },
                      { id: "controls", label: "Controls", icon: Mouse },
                      { id: "client", label: "Client Features", icon: Gamepad2 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          settingsTab === tab.id ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-semibold text-white">
                      {settingsTab === "video" && "Video Settings"}
                      {settingsTab === "audio" && "Music & Sounds"}
                      {settingsTab === "controls" && "Controls"}
                      {settingsTab === "client" && "Client Features"}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Video Settings */}
                  {settingsTab === "video" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Render Distance: {settings.renderDistance} chunks
                          </label>
                          <input
                            type="range"
                            min="2"
                            max="16"
                            value={settings.renderDistance}
                            onChange={(e) =>
                              setSettings((prev) => ({ ...prev, renderDistance: Number(e.target.value) }))
                            }
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">FOV: {settings.fov}°</label>
                          <input
                            type="range"
                            min="30"
                            max="110"
                            value={settings.fov}
                            onChange={(e) => setSettings((prev) => ({ ...prev, fov: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Brightness: {settings.brightness}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.brightness}
                            onChange={(e) => setSettings((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Max Framerate: {settings.maxFramerate} FPS
                          </label>
                          <input
                            type="range"
                            min="30"
                            max="240"
                            step="30"
                            value={settings.maxFramerate}
                            onChange={(e) => setSettings((prev) => ({ ...prev, maxFramerate: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.vsync}
                            onChange={(e) => setSettings((prev) => ({ ...prev, vsync: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          VSync
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.fullscreen}
                            onChange={(e) => setSettings((prev) => ({ ...prev, fullscreen: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          Fullscreen
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Audio Settings */}
                  {settingsTab === "audio" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Master Volume: {settings.masterVolume}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.masterVolume}
                            onChange={(e) => setSettings((prev) => ({ ...prev, masterVolume: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">Music: {settings.musicVolume}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.musicVolume}
                            onChange={(e) => setSettings((prev) => ({ ...prev, musicVolume: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Sound Effects: {settings.soundVolume}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.soundVolume}
                            onChange={(e) => setSettings((prev) => ({ ...prev, soundVolume: Number(e.target.value) }))}
                            className="w-full accent-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-300 block mb-2">
                            Ambient: {settings.ambientVolume}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.ambientVolume}
                            onChange={(e) =>
                              setSettings((prev) => ({ ...prev, ambientVolume: Number(e.target.value) }))
                            }
                            className="w-full accent-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls Settings */}
                  {settingsTab === "controls" && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm text-slate-300 block mb-2">
                          Mouse Sensitivity: {settings.mouseSensitivity}%
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="200"
                          value={settings.mouseSensitivity}
                          onChange={(e) =>
                            setSettings((prev) => ({ ...prev, mouseSensitivity: Number(e.target.value) }))
                          }
                          className="w-full accent-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.invertMouse}
                            onChange={(e) => setSettings((prev) => ({ ...prev, invertMouse: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          Invert Mouse
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.autoJump}
                            onChange={(e) => setSettings((prev) => ({ ...prev, autoJump: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          Auto-Jump
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.toggleCrouch}
                            onChange={(e) => setSettings((prev) => ({ ...prev, toggleCrouch: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          Toggle Crouch
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={settings.toggleSprint}
                            onChange={(e) => setSettings((prev) => ({ ...prev, toggleSprint: e.target.checked }))}
                            className="rounded accent-cyan-500"
                          />
                          Toggle Sprint
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Client Features */}
                  {settingsTab === "client" && (
                    <div className="space-y-6">
                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                        <h5 className="text-cyan-400 font-semibold mb-3">Client Modifications</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.showFPS}
                              onChange={(e) => setSettings((prev) => ({ ...prev, showFPS: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Show FPS
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.showKeystrokes}
                              onChange={(e) => setSettings((prev) => ({ ...prev, showKeystrokes: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Keystroke Display
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.autoGG}
                              onChange={(e) => setSettings((prev) => ({ ...prev, autoGG: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Auto GG
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.showMinimap}
                              onChange={(e) => setSettings((prev) => ({ ...prev, showMinimap: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Minimap
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.showCoords}
                              onChange={(e) => setSettings((prev) => ({ ...prev, showCoords: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Coordinates
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.showCPS}
                              onChange={(e) => setSettings((prev) => ({ ...prev, showCPS: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            CPS Counter
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.zoomEnabled}
                              onChange={(e) => setSettings((prev) => ({ ...prev, zoomEnabled: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Zoom (C Key)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={settings.customCrosshair}
                              onChange={(e) => setSettings((prev) => ({ ...prev, customCrosshair: e.target.checked }))}
                              className="rounded accent-cyan-500"
                            />
                            Custom Crosshair
                          </label>
                        </div>
                      </div>

                      {/* Hidden Hack Settings */}
                      {!hacksUnlocked && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <h5 className="text-red-400 font-semibold mb-3">🔒 Restricted Features</h5>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              placeholder="Enter access code..."
                              value={hackPassword}
                              onChange={(e) => setHackPassword(e.target.value)}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                            <Button
                              onClick={() => {
                                if (hackPassword === "WarriorIsDaBest") {
                                  setHacksUnlocked(true)
                                  setHackPassword("")
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Unlock
                            </Button>
                          </div>
                        </div>
                      )}

                      {hacksUnlocked && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-red-400 font-semibold">⚠️ Hack Features</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setHacksUnlocked(false)}
                              className="text-red-400 hover:text-red-300"
                            >
                              🔒 Lock
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.flyMode}
                                onChange={(e) => setSettings((prev) => ({ ...prev, flyMode: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              Fly Mode
                            </label>
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.speedBoost}
                                onChange={(e) => setSettings((prev) => ({ ...prev, speedBoost: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              Speed Boost
                            </label>
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.xrayVision}
                                onChange={(e) => setSettings((prev) => ({ ...prev, xrayVision: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              X-Ray Vision
                            </label>
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.fullbright}
                                onChange={(e) => setSettings((prev) => ({ ...prev, fullbright: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              Fullbright
                            </label>
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.noClip}
                                onChange={(e) => setSettings((prev) => ({ ...prev, noClip: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              No Clip
                            </label>
                            <label className="flex items-center gap-2 text-sm text-red-300">
                              <input
                                type="checkbox"
                                checked={settings.godMode}
                                onChange={(e) => setSettings((prev) => ({ ...prev, godMode: e.target.checked }))}
                                className="rounded accent-red-500"
                              />
                              God Mode
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Server Browser Modal */}
        {showServers && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-slate-800 border-slate-700 shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Eaglercraft Multiplayer</h3>
                    <p className="text-slate-400 text-sm">Connect to servers using WebSocket (wss://)</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowServers(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
                  {servers.map((server) => (
                    <Card
                      key={server.name}
                      className="bg-slate-700 border-slate-600 p-4 hover:bg-slate-600 cursor-pointer transition-colors"
                      onClick={() => connectToServer(server)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-semibold">{server.name}</h4>
                            {server.eaglercraftCompatible && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Eaglercraft</span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm">{server.ip}</p>
                          <p className="text-slate-400 text-xs">WebSocket: {server.wsUrl}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${server.online ? "bg-green-400" : "bg-red-400"}`}
                            ></div>
                            <p className="text-green-400 text-sm">{server.players}</p>
                          </div>
                          <p className="text-slate-400 text-xs">
                            {server.ping}ms • {server.version}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-600">
                  <h4 className="text-white font-semibold mb-3">Add Custom Server</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Server name (optional)..."
                      value={customServerIP}
                      onChange={(e) => setCustomServerIP(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Input
                      placeholder="WebSocket URL (wss://example.com:8080/)..."
                      value={customServerWS}
                      onChange={(e) => setCustomServerWS(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={connectToCustomServer}
                        className="bg-cyan-600 hover:bg-cyan-700 flex-1"
                        disabled={!customServerWS}
                      >
                        Connect to Server
                      </Button>
                    </div>
                    <div className="text-xs text-slate-400">
                      <p>• Use wss:// for secure connections</p>
                      <p>• Server must support EaglercraftX/Bungee protocol</p>
                      <p>• Default port is usually 8080 for WebSocket</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }
}

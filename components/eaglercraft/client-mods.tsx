"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ClientModsProps {
  engine: any
  settings: any
  onSettingChange: (key: string, value: any) => void
}

export function ClientMods({ engine, settings, onSettingChange }: ClientModsProps) {
  const [cps, setCps] = useState(0)
  const [clicks, setClicks] = useState<number[]>([])
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 })
  const [fps, setFps] = useState(0)
  const [ping, setPing] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (engine) {
        setFps(engine.getFPS())
        if (engine.player) {
          setCoordinates({
            x: Math.round(engine.player.x),
            y: Math.round(engine.player.y),
            z: Math.round(engine.player.z),
          })
        }
      }

      // Update CPS calculation
      const now = Date.now()
      const recentClicks = clicks.filter((click) => now - click < 1000)
      setCps(recentClicks.length)
      setClicks(recentClicks)

      // Simulate ping (in real implementation, this would be actual network latency)
      setPing(Math.floor(Math.random() * 50) + 20)
    }, 100)

    return () => clearInterval(interval)
  }, [engine, clicks])

  const handleClick = () => {
    setClicks((prev) => [...prev, Date.now()])
  }

  useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  if (!settings.showClientMods) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* FPS Counter */}
      {settings.showFPS && (
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/60 text-white border-white/20">
            FPS: {fps}
          </Badge>
        </div>
      )}

      {/* Coordinates Display */}
      {settings.showCoordinates && (
        <div className="absolute top-4 left-20">
          <Badge variant="secondary" className="bg-black/60 text-white border-white/20">
            XYZ: {coordinates.x}, {coordinates.y}, {coordinates.z}
          </Badge>
        </div>
      )}

      {/* CPS Counter */}
      {settings.showCPS && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-black/60 text-white border-white/20">
            CPS: {cps}
          </Badge>
        </div>
      )}

      {/* Ping Display */}
      {settings.showPing && (
        <div className="absolute top-4 right-20">
          <Badge
            variant="secondary"
            className={`bg-black/60 text-white border-white/20 ${
              ping < 50 ? "border-green-500/50" : ping < 100 ? "border-yellow-500/50" : "border-red-500/50"
            }`}
          >
            {ping}ms
          </Badge>
        </div>
      )}

      {/* Armor Status */}
      {settings.showArmorStatus && (
        <div className="absolute bottom-20 left-4">
          <Card className="bg-black/60 border-white/20">
            <CardContent className="p-2">
              <div className="flex gap-1">
                {[100, 85, 70, 90].map((durability, index) => (
                  <div key={index} className="w-8 h-8 bg-gray-700 rounded border border-white/20 relative">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-b"
                      style={{ height: `${durability}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                      {durability}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Potion Effects */}
      {settings.showPotionEffects && (
        <div className="absolute top-20 right-4 space-y-1">
          <Badge variant="secondary" className="bg-red-600/80 text-white border-red-500/50">
            Strength II - 2:30
          </Badge>
          <Badge variant="secondary" className="bg-blue-600/80 text-white border-blue-500/50">
            Speed I - 5:45
          </Badge>
        </div>
      )}

      {/* Crosshair Enhancement */}
      {settings.enhancedCrosshair && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-0.5 bg-white absolute -translate-x-1/2 -translate-y-1/2" />
            <div className="h-4 w-0.5 bg-white absolute -translate-x-1/2 -translate-y-1/2" />
            {settings.crosshairDot && (
              <div className="w-1 h-1 bg-white rounded-full absolute -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
      )}

      {/* Block Overlay */}
      {settings.blockOverlay && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-2 border-white/30 animate-pulse" />
        </div>
      )}
    </div>
  )
}

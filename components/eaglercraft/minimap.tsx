"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MinimapProps {
  engine: any
  isVisible: boolean
  size?: number
}

export function Minimap({ engine, isVisible, size = 150 }: MinimapProps) {
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 })
  const [playerRotation, setPlayerRotation] = useState(0)
  const [nearbyPlayers, setNearbyPlayers] = useState<Array<{ x: number; z: number; name: string }>>([])

  useEffect(() => {
    if (!engine || !isVisible) return

    const interval = setInterval(() => {
      if (engine.player) {
        setPlayerPos({ x: engine.player.x, z: engine.player.z })
        setPlayerRotation(engine.player.yaw)
      }

      // Simulate nearby players (in real implementation, this would come from server)
      setNearbyPlayers([
        { x: playerPos.x + 10, z: playerPos.z + 5, name: "Player1" },
        { x: playerPos.x - 8, z: playerPos.z + 12, name: "Player2" },
      ])
    }, 100)

    return () => clearInterval(interval)
  }, [engine, isVisible, playerPos.x, playerPos.z])

  if (!isVisible) return null

  const scale = 2 // 1 pixel = 2 blocks
  const centerX = size / 2
  const centerY = size / 2

  return (
    <div className="fixed top-4 right-4 z-40">
      <Card className="bg-black/80 border-white/20">
        <CardContent className="p-2">
          <div className="relative bg-green-900 border border-white/30" style={{ width: size, height: size }}>
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Nearby players */}
            {nearbyPlayers.map((player, index) => {
              const relativeX = (player.x - playerPos.x) / scale
              const relativeZ = (player.z - playerPos.z) / scale
              const screenX = centerX + relativeX
              const screenY = centerY + relativeZ

              if (screenX < 0 || screenX > size || screenY < 0 || screenY > size) return null

              return (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1 -translate-y-1"
                  style={{ left: screenX, top: screenY }}
                  title={player.name}
                />
              )
            })}

            {/* Player indicator */}
            <div className="absolute transform -translate-x-1 -translate-y-1" style={{ left: centerX, top: centerY }}>
              <div
                className="w-2 h-2 bg-red-500 rounded-full relative"
                style={{ transform: `rotate(${playerRotation}deg)` }}
              >
                <div className="absolute w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-red-500 -top-1 left-0 transform -translate-x-1/2" />
              </div>
            </div>

            {/* Compass */}
            <div className="absolute top-1 left-1 text-xs text-white">
              <div className="text-center">N</div>
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
              {Math.round(playerPos.x)}, {Math.round(playerPos.z)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

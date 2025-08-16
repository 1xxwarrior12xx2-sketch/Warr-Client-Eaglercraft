"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Drumstick } from "lucide-react"

interface GameHUDProps {
  isVisible: boolean
  player?: any
  onToggleChat: () => void
}

export function GameHUD({ isVisible, player, onToggleChat }: GameHUDProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Health and Hunger */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < (player?.health || 20) / 2 ? "text-red-500 fill-current" : "text-gray-600"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <Drumstick
              key={i}
              className={`w-4 h-4 ${i < (player?.hunger || 20) / 2 ? "text-orange-500 fill-current" : "text-gray-600"}`}
            />
          ))}
        </div>
      </div>

      {/* Chat Button */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Button
          onClick={onToggleChat}
          size="sm"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 bg-black/40"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Coordinates */}
      <div className="absolute top-4 right-4">
        <Badge variant="outline" className="border-white/20 text-white bg-black/40">
          X: {Math.round(player?.x || 0)} Y: {Math.round(player?.y || 64)} Z: {Math.round(player?.z || 0)}
        </Badge>
      </div>
    </div>
  )
}

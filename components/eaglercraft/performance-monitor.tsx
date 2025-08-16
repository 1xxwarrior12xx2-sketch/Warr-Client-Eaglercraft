"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface PerformanceMonitorProps {
  fps: number
  frameTime?: number
  memoryUsage?: number
  chunkLoadProgress?: number
  drawCalls?: number
  isVisible?: boolean
}

export function PerformanceMonitor({
  fps,
  frameTime = 0,
  memoryUsage = 0,
  chunkLoadProgress = 100,
  drawCalls = 0,
  isVisible = true,
}: PerformanceMonitorProps) {
  const getFPSColor = (fps: number) => {
    if (fps >= 60) return "bg-green-600/20 text-green-300 border-green-500/30"
    if (fps >= 30) return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
    return "bg-red-600/20 text-red-300 border-red-500/30"
  }

  const getMemoryColor = (usage: number) => {
    if (usage < 50) return "text-green-400"
    if (usage < 100) return "text-yellow-400"
    return "text-red-400"
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2">
      {/* FPS Badge */}
      <Badge variant="outline" className={getFPSColor(fps)}>
        {fps} FPS
      </Badge>

      <Card className="bg-black/60 border-white/20 backdrop-blur-sm">
        <CardContent className="p-3 space-y-2">
          <div className="text-xs text-white space-y-1">
            <div className="flex justify-between">
              <span>Frame Time:</span>
              <span className="text-gray-300">{frameTime.toFixed(1)}ms</span>
            </div>

            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={getMemoryColor(memoryUsage)}>{memoryUsage.toFixed(1)}MB</span>
            </div>

            <div className="flex justify-between">
              <span>Chunks:</span>
              <span className="text-gray-300">{chunkLoadProgress.toFixed(0)}%</span>
            </div>

            <div className="flex justify-between">
              <span>Draw Calls:</span>
              <span className="text-gray-300">{drawCalls}</span>
            </div>
          </div>

          {chunkLoadProgress < 100 && (
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${chunkLoadProgress}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

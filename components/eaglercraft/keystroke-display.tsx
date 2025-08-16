"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface KeystrokeDisplayProps {
  isVisible: boolean
}

export function KeystrokeDisplay({ isVisible }: KeystrokeDisplayProps) {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    lmb: false,
    rmb: false,
  })

  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setKeys((prev) => ({
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
      setKeys((prev) => ({
        ...prev,
        w: key === "w" ? false : prev.w,
        a: key === "a" ? false : prev.a,
        s: key === "s" ? false : prev.s,
        d: key === "d" ? false : prev.d,
        space: key === " " ? false : prev.space,
        shift: key === "shift" ? false : prev.shift,
      }))
    }

    const handleMouseDown = (e: MouseEvent) => {
      setKeys((prev) => ({
        ...prev,
        lmb: e.button === 0 ? true : prev.lmb,
        rmb: e.button === 2 ? true : prev.rmb,
      }))
    }

    const handleMouseUp = (e: MouseEvent) => {
      setKeys((prev) => ({
        ...prev,
        lmb: e.button === 0 ? false : prev.lmb,
        rmb: e.button === 2 ? false : prev.rmb,
      }))
    }

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
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="absolute bottom-20 right-4 pointer-events-none">
      <Card className="bg-black/60 border-white/20 p-3">
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div></div>
          <div
            className={`w-8 h-8 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.w ? "bg-green-500/50 border-green-400" : "bg-gray-800/50"
            }`}
          >
            W
          </div>
          <div></div>
          <div
            className={`w-8 h-8 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.a ? "bg-green-500/50 border-green-400" : "bg-gray-800/50"
            }`}
          >
            A
          </div>
          <div
            className={`w-8 h-8 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.s ? "bg-green-500/50 border-green-400" : "bg-gray-800/50"
            }`}
          >
            S
          </div>
          <div
            className={`w-8 h-8 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.d ? "bg-green-500/50 border-green-400" : "bg-gray-800/50"
            }`}
          >
            D
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div
            className={`w-full h-6 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.shift ? "bg-blue-500/50 border-blue-400" : "bg-gray-800/50"
            }`}
          >
            SHIFT
          </div>
          <div
            className={`w-full h-6 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.space ? "bg-yellow-500/50 border-yellow-400" : "bg-gray-800/50"
            }`}
          >
            SPACE
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div
            className={`w-full h-6 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.lmb ? "bg-red-500/50 border-red-400" : "bg-gray-800/50"
            }`}
          >
            LMB
          </div>
          <div
            className={`w-full h-6 border border-white/30 rounded flex items-center justify-center text-xs font-mono ${
              keys.rmb ? "bg-purple-500/50 border-purple-400" : "bg-gray-800/50"
            }`}
          >
            RMB
          </div>
        </div>
      </Card>
    </div>
  )
}

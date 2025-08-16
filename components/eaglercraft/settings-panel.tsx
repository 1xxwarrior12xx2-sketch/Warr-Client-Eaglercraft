"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { EaglercraftEngine } from "./engine"

interface SettingsPanelProps {
  isVisible: boolean
  engine: EaglercraftEngine | null
}

export function SettingsPanel({ isVisible, engine }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    renderDistance: 8,
    fov: 70,
    mouseSensitivity: 1.0,
    motionBlur: false,
    vsync: true,
    showFPS: true,
    autoGG: true,
    keystrokeDisplay: true,
    recording: false,
  })

  useEffect(() => {
    if (engine) {
      setSettings(engine.settings)
    }
  }, [engine])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    engine?.updateSetting(key, value)
  }

  if (!isVisible) return null

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Warr Client Settings
          <Badge variant="outline" className="border-purple-500/30 text-purple-300">
            Pro
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graphics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="graphics" className="text-white data-[state=active]:bg-purple-600">
              Graphics
            </TabsTrigger>
            <TabsTrigger value="gameplay" className="text-white data-[state=active]:bg-purple-600">
              Gameplay
            </TabsTrigger>
            <TabsTrigger value="mods" className="text-white data-[state=active]:bg-purple-600">
              Mods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="graphics" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-white">Render Distance: {settings.renderDistance}</Label>
              <Slider
                value={[settings.renderDistance]}
                onValueChange={([value]) => updateSetting("renderDistance", value)}
                max={16}
                min={2}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">FOV: {settings.fov}°</Label>
              <Slider
                value={[settings.fov]}
                onValueChange={([value]) => updateSetting("fov", value)}
                max={120}
                min={30}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Motion Blur</Label>
              <Switch
                checked={settings.motionBlur}
                onCheckedChange={(checked) => updateSetting("motionBlur", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">VSync</Label>
              <Switch checked={settings.vsync} onCheckedChange={(checked) => updateSetting("vsync", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Show FPS</Label>
              <Switch checked={settings.showFPS} onCheckedChange={(checked) => updateSetting("showFPS", checked)} />
            </div>
          </TabsContent>

          <TabsContent value="gameplay" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-white">Mouse Sensitivity: {settings.mouseSensitivity.toFixed(1)}</Label>
              <Slider
                value={[settings.mouseSensitivity]}
                onValueChange={([value]) => updateSetting("mouseSensitivity", value)}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Auto GG</Label>
              <Switch checked={settings.autoGG} onCheckedChange={(checked) => updateSetting("autoGG", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-white">Keystroke Display</Label>
              <Switch
                checked={settings.keystrokeDisplay}
                onCheckedChange={(checked) => updateSetting("keystrokeDisplay", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="mods" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Recording Mode</Label>
              <Switch checked={settings.recording} onCheckedChange={(checked) => updateSetting("recording", checked)} />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Texture Pack</Label>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={() => {
                  /* Open texture pack selector */
                }}
              >
                Load Texture Pack
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Client Mods</Label>
              <div className="grid grid-cols-1 gap-2">
                <Badge
                  variant="secondary"
                  className="justify-center bg-green-600/20 text-green-300 border-green-500/30"
                >
                  ✓ Keystrokes Mod
                </Badge>
                <Badge
                  variant="secondary"
                  className="justify-center bg-green-600/20 text-green-300 border-green-500/30"
                >
                  ✓ FPS Display
                </Badge>
                <Badge
                  variant="secondary"
                  className="justify-center bg-green-600/20 text-green-300 border-green-500/30"
                >
                  ✓ Auto GG
                </Badge>
                <Badge variant="secondary" className="justify-center bg-blue-600/20 text-blue-300 border-blue-500/30">
                  ✓ Replay Mod
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

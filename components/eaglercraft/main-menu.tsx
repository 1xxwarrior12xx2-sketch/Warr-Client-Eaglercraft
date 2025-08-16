"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Settings, Users, Globe, User, Gamepad2, Palette, Info, Github, Heart } from "lucide-react"
import { ServerBrowser } from "./server-browser"
import { ProfileManager } from "./profile-manager"

interface MainMenuProps {
  onStartGame: () => void
  onShowSettings: () => void
  onShowTexturePacks: () => void
}

export function MainMenu({ onStartGame, onShowSettings, onShowTexturePacks }: MainMenuProps) {
  const [selectedTab, setSelectedTab] = useState("singleplayer")
  const [username, setUsername] = useState("Player")
  const [showAbout, setShowAbout] = useState(false)
  const [logoAnimation, setLogoAnimation] = useState(false)

  useEffect(() => {
    // Trigger logo animation on mount
    const timer = setTimeout(() => setLogoAnimation(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="text-center mb-8">
          <div
            className={`flex items-center justify-center gap-6 mb-6 transition-all duration-1000 ${logoAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
                <Gamepad2 className="w-16 h-16 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Warr Client
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mt-2" />
            </div>
          </div>

          <p className="text-2xl text-gray-300 mb-4 font-light">The Ultimate Eaglercraft Experience</p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" />
              Minecraft 1.8-1.12
            </Badge>
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30 px-4 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              WebGL Powered
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
              60+ FPS
            </Badge>
            <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-500/30 px-4 py-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse" />
              Premium Features
            </Badge>
          </div>
        </div>

        <Card className="bg-black/30 border-white/20 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-center text-2xl font-light">Game Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20">
                <TabsTrigger
                  value="singleplayer"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Singleplayer
                </TabsTrigger>
                <TabsTrigger
                  value="multiplayer"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Multiplayer
                </TabsTrigger>
                <TabsTrigger
                  value="servers"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 transition-all duration-300"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Servers
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="singleplayer" className="space-y-6 mt-8">
                <div className="text-center space-y-6">
                  <div className="space-y-3">
                    <label className="text-white text-lg font-medium">Username</label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-lg py-3 backdrop-blur-sm"
                      placeholder="Enter your username"
                    />
                  </div>

                  <Button
                    onClick={onStartGame}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Singleplayer World
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm py-3 transition-all duration-300"
                    >
                      Create World
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm py-3 transition-all duration-300"
                    >
                      Load World
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="multiplayer" className="space-y-6 mt-8">
                <div className="text-center space-y-6">
                  <div className="space-y-3">
                    <label className="text-white text-lg font-medium">Server Address</label>
                    <Input
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-lg py-3 backdrop-blur-sm"
                      placeholder="play.hypixel.net"
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Globe className="w-6 h-6 mr-3" />
                    Connect to Server
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm py-3 transition-all duration-300"
                    >
                      Direct Connect
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm py-3 transition-all duration-300"
                    >
                      Add Server
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="servers" className="mt-8">
                <ServerBrowser onConnect={onStartGame} />
              </TabsContent>

              <TabsContent value="profile" className="mt-8">
                <ProfileManager username={username} onUsernameChange={setUsername} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-center gap-4 mt-10 pt-8 border-t border-white/20">
              <Button
                onClick={onShowSettings}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 transition-all duration-300"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
              <Button
                onClick={onShowTexturePacks}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 transition-all duration-300"
              >
                <Palette className="w-5 h-5 mr-2" />
                Texture Packs
              </Button>
              <Button
                onClick={() => setShowAbout(true)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 transition-all duration-300"
              >
                <Info className="w-5 h-5 mr-2" />
                About
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 space-y-3">
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
            <div>Warr Client v2.1.0</div>
            <div>Build 2024.01.15</div>
          </div>
          <p className="text-gray-500 text-sm">
            Built with <Heart className="w-4 h-4 inline text-red-400" /> using WebGL, Next.js, and modern web
            technologies
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <span>Compatible with Minecraft 1.8 through 1.12</span>
            <span>•</span>
            <span>Optimized for 60+ FPS</span>
            <span>•</span>
            <span>Premium Features Included</span>
          </div>
        </div>
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-black/90 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">About Warr Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-20 h-20 mx-auto mb-4">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Warr Client v2.1.0</h3>
                <p className="text-gray-300">The most advanced Eaglercraft client available</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="text-white font-semibold mb-2">Features</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Advanced texture pack support</li>
                    <li>• Recording & replay system</li>
                    <li>• Motion blur effects</li>
                    <li>• Keystroke display</li>
                    <li>• Auto GG and client mods</li>
                    <li>• Performance optimizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Technical</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• WebGL rendering engine</li>
                    <li>• Next.js framework</li>
                    <li>• TypeScript codebase</li>
                    <li>• Modern UI components</li>
                    <li>• Cross-platform support</li>
                    <li>• 60+ FPS performance</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-gray-400 text-sm mb-4">Created with passion for the Minecraft community</p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setShowAbout(false)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Close
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 bg-white/5">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

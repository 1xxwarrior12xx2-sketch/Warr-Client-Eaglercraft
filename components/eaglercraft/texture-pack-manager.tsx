"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Download, Eye, Check, Star, Trash2, Search } from "lucide-react"

interface TexturePack {
  id: string
  name: string
  description: string
  author: string
  version: string
  resolution: string
  size: string
  preview: string
  downloadUrl?: string
  isActive: boolean
  isDefault: boolean
  rating: number
  downloads: number
}

interface TexturePackManagerProps {
  isVisible: boolean
  onClose: () => void
  onApplyTexturePack: (pack: TexturePack) => void
}

export function TexturePackManager({ isVisible, onClose, onApplyTexturePack }: TexturePackManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("featured")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [texturePacks] = useState<TexturePack[]>([
    {
      id: "default",
      name: "Minecraft Default",
      description: "The classic Minecraft texture pack",
      author: "Mojang",
      version: "1.12",
      resolution: "16x16",
      size: "2.1 MB",
      preview: "/textures/default-preview.png",
      isActive: true,
      isDefault: true,
      rating: 4.5,
      downloads: 1000000,
    },
    {
      id: "faithful",
      name: "Faithful 32x",
      description: "Higher resolution faithful recreation of default textures",
      author: "Faithful Team",
      version: "1.12",
      resolution: "32x32",
      size: "8.4 MB",
      preview: "/textures/faithful-preview.png",
      isActive: false,
      isDefault: false,
      rating: 4.8,
      downloads: 500000,
    },
    {
      id: "sphax",
      name: "Sphax PureBDcraft",
      description: "Cartoon-style texture pack with smooth edges",
      author: "Sphax",
      version: "1.12",
      resolution: "64x64",
      size: "15.2 MB",
      preview: "/textures/sphax-preview.png",
      isActive: false,
      isDefault: false,
      rating: 4.7,
      downloads: 300000,
    },
    {
      id: "dokucraft",
      name: "Dokucraft",
      description: "RPG-style medieval texture pack",
      author: "Doku",
      version: "1.12",
      resolution: "32x32",
      size: "12.8 MB",
      preview: "/textures/dokucraft-preview.png",
      isActive: false,
      isDefault: false,
      rating: 4.6,
      downloads: 250000,
    },
    {
      id: "john-smith",
      name: "John Smith Legacy",
      description: "Rustic and detailed texture pack",
      author: "John Smith",
      version: "1.12",
      resolution: "32x32",
      size: "9.7 MB",
      preview: "/textures/johnsmith-preview.png",
      isActive: false,
      isDefault: false,
      rating: 4.4,
      downloads: 180000,
    },
    {
      id: "soartex",
      name: "Soartex Fanver",
      description: "Smooth and clean texture pack",
      author: "Soar49",
      version: "1.12",
      resolution: "64x64",
      size: "18.3 MB",
      preview: "/textures/soartex-preview.png",
      isActive: false,
      isDefault: false,
      rating: 4.5,
      downloads: 220000,
    },
  ])

  const filteredPacks = texturePacks.filter(
    (pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith(".zip")) {
      console.log("[Warr Client] Uploading texture pack:", file.name)
      // Handle texture pack upload
    }
  }

  const handleApplyPack = (pack: TexturePack) => {
    onApplyTexturePack(pack)
    console.log("[Warr Client] Applied texture pack:", pack.name)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[80vh] bg-black/90 border-white/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl">Texture Pack Manager</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full pb-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-white/5">
                <TabsTrigger value="featured" className="text-white data-[state=active]:bg-purple-600">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="installed" className="text-white data-[state=active]:bg-purple-600">
                  Installed
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-white data-[state=active]:bg-purple-600">
                  Upload
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Search texture packs..."
                  />
                </div>
              </div>
            </div>

            <TabsContent value="featured" className="flex-1">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPacks.map((pack) => (
                    <Card key={pack.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-800 rounded mb-3 overflow-hidden">
                          <img
                            src={
                              pack.preview || "/placeholder.svg?height=120&width=200&query=minecraft texture preview"
                            }
                            alt={pack.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="text-white font-semibold text-sm">{pack.name}</h3>
                            {pack.isActive && (
                              <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-400 text-xs line-clamp-2">{pack.description}</p>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">by {pack.author}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-gray-400">{pack.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{pack.resolution}</span>
                            <span>{pack.size}</span>
                            <span>{pack.downloads.toLocaleString()} DL</span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={() => handleApplyPack(pack)}
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              disabled={pack.isActive}
                            >
                              {pack.isActive ? "Applied" : "Apply"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!pack.isDefault && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="installed" className="flex-1">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {texturePacks
                    .filter((pack) => pack.isActive || !pack.isDefault)
                    .map((pack) => (
                      <Card key={pack.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden">
                              <img
                                src={pack.preview || "/placeholder.svg?height=64&width=64&query=minecraft texture"}
                                alt={pack.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-semibold">{pack.name}</h3>
                                {pack.isActive && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-600/20 text-green-300 border-green-500/30"
                                  >
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">{pack.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Resolution: {pack.resolution}</span>
                                <span>Size: {pack.size}</span>
                                <span>Version: {pack.version}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApplyPack(pack)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={pack.isActive}
                              >
                                {pack.isActive ? "Applied" : "Apply"}
                              </Button>
                              {!pack.isDefault && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="upload" className="flex-1">
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md bg-white/5 border-white/10">
                  <CardContent className="p-8 text-center">
                    <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">Upload Texture Pack</h3>
                    <p className="text-gray-400 mb-6">Upload your own texture pack (.zip file) to use in Warr Client</p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Supported formats: .zip</p>
                      <p>• Max file size: 50MB</p>
                      <p>• Resolutions: 16x16 to 512x512</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, Wifi, Star } from "lucide-react"

interface Server {
  id: string
  name: string
  address: string
  players: number
  maxPlayers: number
  ping: number
  version: string
  description: string
  featured: boolean
}

interface ServerBrowserProps {
  onConnect: () => void
}

export function ServerBrowser({ onConnect }: ServerBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [servers] = useState<Server[]>([
    {
      id: "1",
      name: "Hypixel Network",
      address: "play.hypixel.net",
      players: 45231,
      maxPlayers: 50000,
      ping: 45,
      version: "1.8-1.12",
      description: "The largest Minecraft server with unique games!",
      featured: true,
    },
    {
      id: "2",
      name: "Mineplex",
      address: "us.mineplex.com",
      players: 12543,
      maxPlayers: 15000,
      ping: 67,
      version: "1.8-1.12",
      description: "Fun minigames and competitive gameplay",
      featured: true,
    },
    {
      id: "3",
      name: "CubeCraft Games",
      address: "play.cubecraft.net",
      players: 8921,
      maxPlayers: 12000,
      ping: 32,
      version: "1.8-1.12",
      description: "Unique games and friendly community",
      featured: false,
    },
    {
      id: "4",
      name: "The Hive",
      address: "play.hivemc.com",
      players: 15432,
      maxPlayers: 20000,
      ping: 28,
      version: "1.8-1.12",
      description: "Quality games with smooth gameplay",
      featured: false,
    },
  ])

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPingColor = (ping: number) => {
    if (ping < 50) return "text-green-400"
    if (ping < 100) return "text-yellow-400"
    return "text-red-400"
  }

  const getPlayerColor = (players: number, maxPlayers: number) => {
    const ratio = players / maxPlayers
    if (ratio < 0.5) return "text-green-400"
    if (ratio < 0.8) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          placeholder="Search servers..."
        />
      </div>

      {/* Server List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredServers.map((server) => (
          <Card key={server.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{server.name}</h3>
                    {server.featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{server.description}</p>
                  <p className="text-gray-500 text-xs">{server.address}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`flex items-center gap-1 ${getPlayerColor(server.players, server.maxPlayers)}`}>
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {server.players.toLocaleString()}/{server.maxPlayers.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Players</p>
                  </div>

                  <div className="text-center">
                    <div className={`flex items-center gap-1 ${getPingColor(server.ping)}`}>
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm font-medium">{server.ping}ms</span>
                    </div>
                    <p className="text-xs text-gray-500">Ping</p>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {server.version}
                    </Badge>
                  </div>

                  <Button onClick={onConnect} size="sm" className="bg-green-600 hover:bg-green-700">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No servers found matching your search.</p>
        </div>
      )}
    </div>
  )
}

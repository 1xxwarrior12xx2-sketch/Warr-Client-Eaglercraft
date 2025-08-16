"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Upload, Download, Trash2 } from "lucide-react"

interface ProfileManagerProps {
  username: string
  onUsernameChange: (username: string) => void
}

export function ProfileManager({ username, onUsernameChange }: ProfileManagerProps) {
  const [profiles] = useState([
    { id: "1", name: "Player", skin: "/minecraft-steve.png", active: true },
    { id: "2", name: "ProGamer", skin: "/minecraft-alex.png", active: false },
    { id: "3", name: "Builder", skin: "/minecraft-custom-landscape.png", active: false },
  ])

  return (
    <div className="space-y-4">
      {/* Current Profile */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/minecraft-steve.png" />
              <AvatarFallback className="bg-purple-600 text-white">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="space-y-2">
                <Label className="text-white">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter username"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skin Management */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-3">Skin Management</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload Skin
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Skin
            </Button>
          </div>
          <div className="text-center">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Profiles */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-3">Saved Profiles</h3>
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile.skin || "/placeholder.svg"} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white">{profile.name}</span>
                  {profile.active && (
                    <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 w-8 p-0">
                    <User className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

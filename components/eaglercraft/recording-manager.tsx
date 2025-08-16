"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Download,
  Share,
  Trash2,
  Eye,
  Clock,
  Calendar,
  FileVideo,
  Settings,
} from "lucide-react"

interface Recording {
  id: string
  name: string
  duration: number
  size: string
  date: Date
  thumbnail: string
  description: string
  tags: string[]
  fps: number
  resolution: string
}

interface RecordingManagerProps {
  isVisible: boolean
  onClose: () => void
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
}

export function RecordingManager({
  isVisible,
  onClose,
  isRecording,
  onStartRecording,
  onStopRecording,
}: RecordingManagerProps) {
  const [selectedTab, setSelectedTab] = useState("recordings")
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const [recordings] = useState<Recording[]>([
    {
      id: "1",
      name: "Epic PvP Battle",
      duration: 180,
      size: "45.2 MB",
      date: new Date(2024, 0, 15),
      thumbnail: "/recordings/pvp-battle-thumb.png",
      description: "Amazing 1v3 clutch in Hypixel Skywars",
      tags: ["PvP", "Skywars", "Clutch"],
      fps: 60,
      resolution: "1920x1080",
    },
    {
      id: "2",
      name: "Speedrun Attempt",
      duration: 420,
      size: "89.7 MB",
      date: new Date(2024, 0, 12),
      thumbnail: "/recordings/speedrun-thumb.png",
      description: "Personal best speedrun attempt",
      tags: ["Speedrun", "PB", "Any%"],
      fps: 60,
      resolution: "1920x1080",
    },
    {
      id: "3",
      name: "Building Timelapse",
      duration: 300,
      size: "67.3 MB",
      date: new Date(2024, 0, 10),
      thumbnail: "/recordings/building-thumb.png",
      description: "Castle build timelapse",
      tags: ["Building", "Timelapse", "Creative"],
      fps: 30,
      resolution: "1920x1080",
    },
  ])

  const filteredRecordings = recordings.filter(
    (recording) =>
      recording.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimelineChange = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleSpeedChange = (value: number[]) => {
    setPlaybackSpeed(value[0])
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-7xl h-[85vh] bg-black/90 border-white/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl">Recording & Replay Manager</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isRecording ? "destructive" : "secondary"} className="px-3">
                {isRecording ? "Recording..." : "Ready"}
              </Badge>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full pb-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
            <TabsList className="bg-white/5 mb-4">
              <TabsTrigger value="recordings" className="text-white data-[state=active]:bg-purple-600">
                <FileVideo className="w-4 h-4 mr-2" />
                Recordings
              </TabsTrigger>
              <TabsTrigger value="replay" className="text-white data-[state=active]:bg-purple-600">
                <Play className="w-4 h-4 mr-2" />
                Replay Viewer
              </TabsTrigger>
              <TabsTrigger value="record" className="text-white data-[state=active]:bg-purple-600">
                <Square className="w-4 h-4 mr-2" />
                Record
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recordings" className="flex-1">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Search recordings..."
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Import
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Export All
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecordings.map((recording) => (
                      <Card
                        key={recording.id}
                        className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gray-800 rounded mb-3 overflow-hidden relative">
                            <img
                              src={
                                recording.thumbnail ||
                                "/placeholder.svg?height=120&width=200&query=minecraft gameplay recording"
                              }
                              alt={recording.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {formatDuration(recording.duration)}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-white font-semibold text-sm">{recording.name}</h3>
                            <p className="text-gray-400 text-xs line-clamp-2">{recording.description}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{recording.date.toLocaleDateString()}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{recording.size}</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {recording.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-purple-500/30 text-purple-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={() => {
                                  setSelectedRecording(recording)
                                  setSelectedTab("replay")
                                }}
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                              >
                                <Share className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="replay" className="flex-1">
              {selectedRecording ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 bg-black rounded-lg mb-4 relative overflow-hidden">
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-xl font-semibold mb-2">{selectedRecording.name}</h3>
                        <p className="text-gray-400">{selectedRecording.description}</p>
                      </div>
                    </div>

                    {/* Replay Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="space-y-3">
                        {/* Timeline */}
                        <div className="flex items-center gap-3">
                          <span className="text-white text-sm min-w-[40px]">{formatDuration(currentTime)}</span>
                          <Slider
                            value={[currentTime]}
                            onValueChange={handleTimelineChange}
                            max={selectedRecording.duration}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-white text-sm min-w-[40px]">
                            {formatDuration(selectedRecording.duration)}
                          </span>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button onClick={handlePlayPause} size="sm" className="bg-purple-600 hover:bg-purple-700">
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <SkipForward className="w-4 h-4" />
                          </Button>

                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-white text-sm">Speed:</span>
                            <Slider
                              value={[playbackSpeed]}
                              onValueChange={handleSpeedChange}
                              min={0.25}
                              max={4}
                              step={0.25}
                              className="w-20"
                            />
                            <span className="text-white text-sm min-w-[30px]">{playbackSpeed}x</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recording Info */}
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <p className="text-white">{formatDuration(selectedRecording.duration)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Resolution:</span>
                          <p className="text-white">{selectedRecording.resolution}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">FPS:</span>
                          <p className="text-white">{selectedRecording.fps}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Size:</span>
                          <p className="text-white">{selectedRecording.size}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Eye className="w-16 h-16 mx-auto mb-4" />
                    <p>Select a recording to start replay</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="record" className="flex-1">
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md bg-white/5 border-white/10">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isRecording ? "bg-red-600 animate-pulse" : "bg-purple-600"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-8 h-8 text-white" />
                      ) : (
                        <FileVideo className="w-8 h-8 text-white" />
                      )}
                    </div>

                    <h3 className="text-white text-xl font-semibold mb-2">
                      {isRecording ? "Recording in Progress" : "Start Recording"}
                    </h3>

                    <p className="text-gray-400 mb-6">
                      {isRecording
                        ? "Your gameplay is being recorded. Click stop when finished."
                        : "Record your gameplay to create amazing replays and share with others."}
                    </p>

                    <Button
                      onClick={isRecording ? onStopRecording : onStartRecording}
                      size="lg"
                      className={`w-full mb-4 ${
                        isRecording ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-5 h-5 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <FileVideo className="w-5 h-5 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Recording Settings
                    </Button>

                    <div className="text-xs text-gray-500 mt-4 space-y-1">
                      <p>• Max recording time: 30 minutes</p>
                      <p>• Resolution: 1920x1080 @ 60fps</p>
                      <p>• Format: MP4 (H.264)</p>
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

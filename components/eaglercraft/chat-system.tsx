"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send } from "lucide-react"

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  type: "chat" | "system" | "private"
}

interface ChatSystemProps {
  isVisible: boolean
  onClose: () => void
}

export function ChatSystem({ isVisible, onClose }: ChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "System",
      message: "Welcome to Warr Client!",
      timestamp: new Date(),
      type: "system",
    },
    {
      id: "2",
      username: "Player123",
      message: "Hey everyone!",
      timestamp: new Date(),
      type: "chat",
    },
    {
      id: "3",
      username: "ProGamer",
      message: "Nice client!",
      timestamp: new Date(),
      type: "chat",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: currentMessage,
      timestamp: new Date(),
      type: "chat",
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")

    // Auto GG feature
    if (currentMessage.toLowerCase().includes("gg") || currentMessage.toLowerCase().includes("good game")) {
      setTimeout(() => {
        const autoGGMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          username: "AutoGG",
          message: "Good game!",
          timestamp: new Date(),
          type: "system",
        }
        setMessages((prev) => [...prev, autoGGMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-96 bg-black/80 border-white/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Chat</CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full pb-4">
          <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
            <div className="space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span
                    className={`font-semibold ${
                      msg.type === "system"
                        ? "text-yellow-400"
                        : msg.type === "private"
                          ? "text-purple-400"
                          : "text-blue-400"
                    }`}
                  >
                    [{msg.timestamp.toLocaleTimeString()}] {msg.username}:
                  </span>
                  <span className="text-white ml-2">{msg.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="Type your message..."
              maxLength={256}
            />
            <Button onClick={sendMessage} size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

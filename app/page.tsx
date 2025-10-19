import { Download, Gamepad2, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Gamepad2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Warr Client Eaglercraft</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Play Minecraft in your browser - Perfect for Chromebooks
            </p>
          </div>

          {/* Download Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Chrome className="h-5 w-5" />
                Download for Chromebook
              </CardTitle>
              <CardDescription>Download the standalone HTML file to play offline on your Chromebook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">How to use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click the download button below</li>
                  <li>Open the downloaded HTML file in Chrome</li>
                  <li>Allow the page to load completely</li>
                  <li>Click "Play" to start the game</li>
                  <li>Enjoy Minecraft in your browser!</li>
                </ol>
              </div>

              <Button asChild size="lg" className="w-full">
                <a href="/eaglercraft-game.html" download="eaglercraft-game.html">
                  <Download className="mr-2 h-5 w-5" />
                  Download Game (HTML)
                </a>
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                No installation required • Works offline • Chromebook compatible
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offline Play</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Once downloaded, play without an internet connection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No Install</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Just open the HTML file in your browser and play</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chromebook Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Optimized for Chrome OS and Chromebook devices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, Download, Trash2, Code, Terminal } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { MessageBubble } from "@/components/message-bubble"

export default function AICodeAgent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
  })

  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    })
  }

  const exportChat = () => {
    const chatContent = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")
    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-code-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Chat exported",
      description: "Chat history has been downloaded.",
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <Card className="mb-4 shadow-lg border border-gray-800 bg-black/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    AI Code Agent
                  </CardTitle>
                  <p className="text-sm text-slate-400">Convert natural language to code with AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 bg-slate-700 text-slate-200 border-slate-600">
                  <Terminal className="h-3 w-3" />
                  OpenAI Powered
                </Badge>
                <Button variant="outline" size="sm" onClick={exportChat} disabled={messages.length === 0}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={clearChat} disabled={messages.length === 0}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-lg border border-gray-800 bg-black/95 backdrop-blur-sm">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-gray-900 rounded-full">
                    <Code className="h-12 w-12 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Welcome to AI Code Agent</h3>
                    <p className="text-gray-400 max-w-md">
                      Describe what you want to build in natural language, and I'll generate the code for you.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800">
                      <p className="text-sm font-medium text-gray-200">Example:</p>
                      <p className="text-xs text-gray-400 mt-1">
                        "Create a Python function to sort a list of dictionaries by a specific key"
                      </p>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800">
                      <p className="text-sm font-medium text-gray-200">Example:</p>
                      <p className="text-xs text-gray-400 mt-1">
                        "Write a JavaScript function to validate email addresses"
                      </p>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <MessageBubble key={message.id} message={message} onCopy={copyToClipboard} copied={copied} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <Separator className="bg-gray-800" />

            {/* Input Area */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Describe the code you want to generate..."
                    className="pr-12 h-12 text-base bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="px-6">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • Supports Python, JavaScript, TypeScript, and more
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, User, Bot } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import type { Message } from "ai"

interface MessageBubbleProps {
  message: Message
  onCopy: (text: string, id: string) => void
  copied: string | null
}

export function MessageBubble({ message, onCopy, copied }: MessageBubbleProps) {
  const isUser = message.role === "user"

  // Simple code detection - looks for code blocks or common programming patterns
const hasCode =
  message.content?.includes("```") ||
  /\b(function|def|class|import|const|let|var|if|for|while)\b/.test(message.content || "");


  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>

      <div className={`flex-1 max-w-[80%] ${isUser ? "flex flex-col items-end" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant={isUser ? "default" : "secondary"}
            className={`text-xs ${isUser ? "bg-white text-black" : "bg-gray-800 text-gray-200"}`}
          >
            {isUser ? "You" : "AI Assistant"}
          </Badge>
        </div>

        <Card
          className={`p-4 ${isUser ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-900/90 border-gray-700 text-white"}`}
        >
          {hasCode && !isUser ? (
            <div className="space-y-3">
              <CodeBlock content={message.content} onCopy={onCopy} copied={copied} messageId={message.id} />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {!isUser && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(message.content, message.id)}
                    className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied === message.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

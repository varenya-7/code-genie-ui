"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download } from "lucide-react"

interface CodeBlockProps {
  content: string
  onCopy: (text: string, id: string) => void
  copied: string | null
  messageId: string
}

export function CodeBlock({ content, onCopy, copied, messageId }: CodeBlockProps) {
  // Extract code blocks and regular text
  const parts = content.split(/(```[\s\S]*?```)/g)

  const downloadCode = (code: string, language: string) => {
    const extension = getFileExtension(language)
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      sql: "sql",
      bash: "sh",
      shell: "sh",
      json: "json",
      xml: "xml",
      yaml: "yml",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
    }
    return extensions[language.toLowerCase()] || "txt"
  }

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
      javascript: "bg-yellow-600 text-black border-yellow-500",
      typescript: "bg-blue-600 text-white border-blue-500",
      python: "bg-green-600 text-white border-green-500",
      java: "bg-orange-600 text-white border-orange-500",
      cpp: "bg-purple-600 text-white border-purple-500",
      html: "bg-red-600 text-white border-red-500",
      css: "bg-pink-600 text-white border-pink-500",
      sql: "bg-indigo-600 text-white border-indigo-500",
    }
    return colors[language.toLowerCase()] || "bg-gray-700 text-white border-gray-600"
  }

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // This is a code block
          const lines = part.split("\n")
          const language = lines[0].replace("```", "").trim() || "text"
          const code = lines.slice(1, -1).join("\n")

          if (!code.trim()) return null

          return (
            <Card key={index} className="overflow-hidden border border-gray-700 shadow-sm bg-black">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Badge className={getLanguageColor(language)}>{language}</Badge>
                  <span className="text-xs text-gray-400">{code.split("\n").length} lines</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(code, `${messageId}-${index}`)}
                    className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied === `${messageId}-${index}` ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadCode(code, language)}
                    className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-black overflow-x-auto">
                <pre className="text-sm text-white">
                  <code>{code}</code>
                </pre>
              </div>
            </Card>
          )
        } else if (part.trim()) {
          // This is regular text
          return (
            <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap text-white">
              {part}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

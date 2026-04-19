"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 10,
  className,
}: TagInputProps) {
  const [input, setInput] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(s) &&
      input.length > 0
  )

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !value.includes(normalizedTag) && value.length < maxTags) {
      onChange([...value, normalizedTag])
    }
    setInput("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (input.trim()) addTag(input)
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background transition-all">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={value.length >= maxTags}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-xl animate-fade-in">
          {filteredSuggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                addTag(suggestion)
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

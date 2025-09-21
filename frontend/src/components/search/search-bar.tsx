import React, { useState, useRef, useEffect } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Search, 
  Mic, 
  MicOff, 
  X, 
  Filter,
  Loader2
} from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  showFilters?: boolean
  onToggleFilters?: () => void
  isLoading?: boolean
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search for crafts, artisans, or categories...",
  showFilters = true,
  onToggleFilters,
  isLoading = false,
  suggestions = [],
  onSuggestionClick,
  className = ""
}: SearchBarProps) {
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onChange(transcript)
        onSearch(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [onChange, onSearch])

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop()
      } else {
        recognition.start()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    }
  }

  const clearSearch = () => {
    onChange('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(value.length > 0 && suggestions.length > 0)}
          className="pl-10 pr-20 bg-input-background border-primary/20 focus:border-primary/40 rounded-xl"
          disabled={isLoading}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {recognition && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceSearch}
              className={`h-6 w-6 p-0 ${
                isListening 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'hover:bg-muted'
              }`}
              disabled={isLoading}
            >
              {isListening ? (
                <MicOff className="h-3 w-3" />
              ) : (
                <Mic className="h-3 w-3" />
              )}
            </Button>
          )}
          
          {showFilters && onToggleFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFilters}
              className="h-6 w-6 p-0 hover:bg-muted"
              disabled={isLoading}
            >
              <Filter className="h-3 w-3" />
            </Button>
          )}
          
          {isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Voice search indicator */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening... Speak now
          </div>
        </div>
      )}

      {/* Search suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Suggestions</div>
            {suggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
              >
                <Search className="h-3 w-3 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search tips */}
      {value.length > 0 && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-blue-600 text-xs">
            Press Enter to search or use voice search
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { 
  Send, 
  Search, 
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Video,
  Info
} from 'lucide-react'
import { useRouter } from '../router'
import { useAuth } from '../auth/auth-context'
import { useChat } from './chat-context'
import NavigationHeader from '../navigation-header'

export default function MessagesPage() {
  const { navigate, goBack } = useRouter()
  const { user } = useAuth()
  const { chats, activeChat, messages, setActiveChat, sendMessage, markAsRead } = useChat()
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.participants.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && activeChat) {
      sendMessage(activeChat.id, newMessage.trim())
      setNewMessage('')
    }
  }

  const handleChatSelect = (chat: typeof chats[0]) => {
    setActiveChat(chat)
    if (chat.unreadCount > 0) {
      markAsRead(chat.id)
    }
  }

  const getOtherParticipant = (chat: typeof chats[0]) => {
    return user?.role === 'customer' 
      ? { name: chat.participants.artisanName, avatar: chat.participants.artisanAvatar }
      : { name: chat.participants.customerName, avatar: chat.participants.customerAvatar }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === new Date(today.getTime() - 86400000).toDateString()
    
    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 botanical-pattern">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-card/60">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Messages
            </h1>
            <p className="text-muted-foreground">
              Connect directly with {user?.role === 'customer' ? 'artisans' : 'customers'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] max-w-full overflow-hidden">
          {/* Chat List */}
          <Card className="border-0 bg-card/60 backdrop-blur-sm card-shadow overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background border-primary/20"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-8 px-6">
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2 w-full">
                    {filteredChats.map((chat) => {
                      const otherParticipant = getOtherParticipant(chat)
                      return (
                        <div
                          key={chat.id}
                          onClick={() => handleChatSelect(chat)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary/40 ${
                            activeChat?.id === chat.id ? 'bg-secondary/60' : ''
                          } w-full`}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {chat.isActive && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate max-w-[120px]">{otherParticipant.name}</h4>
                              {chat.lastMessage && (
                                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                  {formatDate(chat.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate max-w-full">
                                {chat.lastMessage.content}
                              </p>
                            )}
                          </div>
                          
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center flex-shrink-0">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 border-0 bg-card/60 backdrop-blur-sm card-shadow flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={getOtherParticipant(activeChat).avatar} 
                          alt={getOtherParticipant(activeChat).name} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getOtherParticipant(activeChat).name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{getOtherParticipant(activeChat).name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activeChat.isActive ? 'Online' : 'Last seen recently'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="hover:bg-secondary/40">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-secondary/40">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-secondary/40">
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-secondary/40">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[350px] p-4">
                    <div className="space-y-4">
                      {messages[activeChat.id]?.map((message) => {
                        const isOwnMessage = message.senderId === user?.id
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words ${
                              isOwnMessage 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary/60'
                            }`}>
                              <p className="text-sm break-words overflow-wrap-anywhere">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isOwnMessage 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-border/60">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-secondary/40"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-secondary/40"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-input-background border-primary/20"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary/60 rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose a conversation from the left to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
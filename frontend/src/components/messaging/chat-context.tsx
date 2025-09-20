import { createContext, useContext, useState, ReactNode } from 'react'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'image' | 'product'
  productId?: string
}

export interface Chat {
  id: string
  participants: {
    customerId: string
    customerName: string
    customerAvatar?: string
    artisanId: string
    artisanName: string
    artisanAvatar?: string
  }
  lastMessage?: Message
  unreadCount: number
  isActive: boolean
  createdAt: Date
}

interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  messages: Record<string, Message[]>
  setActiveChat: (chat: Chat | null) => void
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'product', productId?: string) => void
  markAsRead: (chatId: string) => void
  createChat: (customerId: string, artisanId: string) => Chat
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  
  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: 'chat_1',
      participants: {
        customerId: 'customer_1',
        customerName: 'Rajesh Kumar',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBhcnRpc2FufGVufDF8fHx8MTc1ODM2NjIxN3ww&ixlib=rb-4.1.0&q=80&w=400',
        artisanId: 'artisan_1',
        artisanName: 'Priya Sharma',
        artisanAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGFydGlzYW58ZW58MXx8fHwxNzU4MzY2MjE2fDA&ixlib=rb-4.1.0&q=80&w=400'
      },
      lastMessage: {
        id: 'msg_3',
        senderId: 'artisan_1',
        senderName: 'Priya Sharma',
        content: 'Thank you for your interest! I can definitely customize the colors for you.',
        timestamp: new Date('2024-01-15T14:30:00'),
        isRead: false,
        type: 'text'
      },
      unreadCount: 1,
      isActive: true,
      createdAt: new Date('2024-01-15T10:00:00')
    },
    {
      id: 'chat_2',
      participants: {
        customerId: 'customer_1',
        customerName: 'Rajesh Kumar',
        artisanId: 'artisan_2',
        artisanName: 'Meera Patel',
        artisanAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGFydGlzYW4lMjBqZXdlbHJ5fGVufDF8fHx8MTc1ODM2NjIxOHww&ixlib=rb-4.1.0&q=80&w=400'
      },
      lastMessage: {
        id: 'msg_6',
        senderId: 'customer_1',
        senderName: 'Rajesh Kumar',
        content: 'Could you show me more designs in silver filigree?',
        timestamp: new Date('2024-01-14T16:45:00'),
        isRead: true,
        type: 'text'
      },
      unreadCount: 0,
      isActive: false,
      createdAt: new Date('2024-01-14T12:00:00')
    }
  ])

  const [messages] = useState<Record<string, Message[]>>({
    chat_1: [
      {
        id: 'msg_1',
        senderId: 'customer_1',
        senderName: 'Rajesh Kumar',
        content: 'Hi, I\'m interested in your Banarasi silk sarees. Do you have any in royal blue?',
        timestamp: new Date('2024-01-15T10:15:00'),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg_2',
        senderId: 'artisan_1',
        senderName: 'Priya Sharma',
        content: 'Hello! Yes, I have a beautiful royal blue Banarasi saree with gold zari work. Would you like to see some photos?',
        timestamp: new Date('2024-01-15T10:30:00'),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg_3',
        senderId: 'artisan_1',
        senderName: 'Priya Sharma',
        content: 'Thank you for your interest! I can definitely customize the colors for you.',
        timestamp: new Date('2024-01-15T14:30:00'),
        isRead: false,
        type: 'text'
      }
    ],
    chat_2: [
      {
        id: 'msg_4',
        senderId: 'customer_1',
        senderName: 'Rajesh Kumar',
        content: 'I loved the silver earrings in your portfolio. Are they still available?',
        timestamp: new Date('2024-01-14T12:15:00'),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg_5',
        senderId: 'artisan_2',
        senderName: 'Meera Patel',
        content: 'Yes, they are! I can make them in different sizes too. What size would you prefer?',
        timestamp: new Date('2024-01-14T14:20:00'),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg_6',
        senderId: 'customer_1',
        senderName: 'Rajesh Kumar',
        content: 'Could you show me more designs in silver filigree?',
        timestamp: new Date('2024-01-14T16:45:00'),
        isRead: true,
        type: 'text'
      }
    ]
  })

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image' | 'product' = 'text', productId?: string) => {
    // In a real app, this would send to the backend
    console.log('Sending message:', { chatId, content, type, productId })
  }

  const markAsRead = (chatId: string) => {
    // In a real app, this would update the backend
    console.log('Marking chat as read:', chatId)
  }

  const createChat = (customerId: string, artisanId: string): Chat => {
    // In a real app, this would create a new chat in the backend
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants: {
        customerId,
        customerName: 'Current User',
        artisanId,
        artisanName: 'Artisan Name'
      },
      unreadCount: 0,
      isActive: true,
      createdAt: new Date()
    }
    return newChat
  }

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      messages,
      setActiveChat,
      sendMessage,
      markAsRead,
      createChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
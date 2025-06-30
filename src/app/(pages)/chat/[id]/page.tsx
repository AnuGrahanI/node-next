"use client";

import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/use-webSocket";
import ChatInput from "@/component/conversation/chat-input";
import apiClient from "@/lib/apiClient";

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
  from: "me" | "other";
}

export default function ChatPage() {
  const { id } = useParams();
  console.log(id, "id");
  
  const router = useRouter();
  const userString = sessionStorage.getItem('user');
const user: any | null = userString ? JSON.parse(userString) : null;

  
  const [otherUser, setOtherUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const userId = user?.id;
  
  const { isConnected, sendMessage } = useWebSocket(userId || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user details
        const userRes = await apiClient.get(`/api/user/${id}`);
        const userData = await userRes;
        console.log(userData, "userData");
        
        if (userData.success) {
          setOtherUser(userData.data);
        }

        // Fetch messages
        const messagesRes = await apiClient.get(`/api/chat/messages/${id}`);
        const messagesData: any = await messagesRes;
        if (messagesData.success) {
          const transformedMessages = messagesData?.messages.map((msg: any) => ({
            ...msg,
            from: msg.sender === userId ? "me" : "other"
          }));
          setMessages(transformedMessages);
        }

        // Mark messages as read
        await apiClient.post('/api/chat/mark-read', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senderId: id })
        });
      } catch (error) {
        console.error('Failed to fetch chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && id) {
      fetchData();
    }
  }, [id, userId]);

useEffect(() => {
  if (isConnected && userId && id) {
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      
      // Handle incoming chat messages
      if (message.type === 'chat' && message.senderId === id) {
        setMessages(prev => [...prev, {
          _id: message._id || Date.now().toString(),
          senderId: message.senderId,
          content: message.content,
          createdAt: message.createdAt || new Date().toISOString(),
          from: "other" as const
        }]);
      }
      
      // Handle typing indicators
      if (message.type === 'typing' && message.senderId === id) {
        setIsTyping(message.isTyping);
      }
    };

    // Get the WebSocket instance from your hook
    const ws = (useWebSocket as any).ws; // You'll need to expose this from your hook
    
    if (ws) {
      ws.addEventListener('message', handleMessage);
      
      // Cleanup function
      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }
}, [isConnected, id, userId]);

 
  const handleSend = async (message: string) => {
  if (!message.trim() || !userId || !id) return;

  // Optimistic UI update
  const tempId = Date.now().toString();
  const newMessage = {
    _id: tempId,
    senderId: userId,
    content: message,
    createdAt: new Date().toISOString(),
    from: "me" as const
  };
  setMessages(prev => [...prev, newMessage]);

  try {
    // Send via WebSocket for real-time
    sendMessage({
      type: 'chat',
      senderId: userId,
      receiverId: id,
      content: message
    });

    // Also send to API for persistence
    const response = await apiClient.post('/api/chat/send', {
      receiverId: id,
      content: message
    });

    const data:any = await response;
    if (data.success) {
      // Replace temporary ID with real ID from server
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, _id: data?.message?._id } : msg
      ));
    } else {
      // Remove if failed
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      console.error('Failed to send message:', data.message);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    setMessages(prev => prev.filter(msg => msg._id !== tempId));
  }
};

  const handleTyping = (isTyping: boolean) => {
    if (isConnected && userId && id) {
      sendMessage({
        type: 'typing',
        senderId: userId,
        receiverId: id,
        isTyping
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!otherUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderBottom="1px solid #ccc"
        bgcolor="background.paper"
      >
        <IconButton onClick={() => router.push("/chat")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <img
            src={otherUser.image || "https://picsum.photos/200/300"}
            alt={otherUser.name}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </Box>
        <Box ml={1}>
          <Typography variant="h6">{otherUser.name}</Typography>
          {isTyping && (
            <Typography variant="caption" color="text.secondary">
              Typing...
            </Typography>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        flexGrow={1} 
        p={2} 
        overflow="auto" 
        display="flex" 
        flexDirection="column" 
        gap={1}
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        {messages.map((msg) => (
          <Box
            key={msg._id}
            alignSelf={msg.from === "me" ? "flex-end" : "flex-start"}
            bgcolor={msg.from === "me" ? "#1976d2" : "#fff"}
            color={msg.from === "me" ? "#fff" : "#000"}
            px={2}
            py={1}
            borderRadius={2}
            maxWidth="75%"
            boxShadow={1}
          >
            {msg.content}
            <Typography 
              variant="caption" 
              display="block" 
              textAlign="right"
              color={msg.from === "me" ? "rgba(255,255,255,0.7)" : "text.secondary"}
              mt={0.5}
            >
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        ))}
      </Box>

      <ChatInput 
        onSend={handleSend} 
        onTyping={handleTyping}
      />
    </Box>
  );
}
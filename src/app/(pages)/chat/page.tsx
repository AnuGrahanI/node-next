"use client";

import { Box, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-webSocket";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/use-auth";
import moment from 'moment';


interface Friend {
  _id: string;
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function ChatListPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
const {user }=useAuth()
  
  const { messages: wsMessages } = useWebSocket(user?.id || '');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await apiClient.get('/api/chat/friends');
        const data:any = await response;
        if (data.success) {
          setFriends(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    // Update last message when new WebSocket messages arrive
    if (wsMessages.length > 0) {
      const lastMessage = wsMessages[wsMessages.length - 1];
      if (lastMessage.type === 'chat') {
        setFriends(prev => prev.map(friend => {
          if (friend._id === lastMessage.senderId) {
            return {
              ...friend,
              lastMessage: lastMessage.content,
              lastMessageTime: 'Just now',
              unreadCount: (friend.unreadCount || 0) + 1
            };
          }
          return friend;
        }));
      }
    }
  }, [wsMessages]);



  return (
    <Box mx="auto">
      <Typography variant="h5" gutterBottom>
        Chats
      </Typography>
      <List>
        {loading ? (
          Array(5).fill(0).map((_, index) => (
            <ListItem key={index}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
                <Box>
                  <Skeleton variant="text" width={40} height={20} />
                </Box>
              </Box>
            </ListItem>
          ))
        ) : (
        friends.map((friend) => (
          <ListItem
            key={friend._id}
            onClick={() => router.push(`/chat/${friend._id}`)}
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              "&:hover": { backgroundColor: "action.hover" } 
            }}
          >
            <Box sx={{ mr: 1 }}>
              <img
                src={friend.image || "https://picsum.photos/200/300"}
                alt={friend.name}
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            </Box>

            <Box flexGrow={1}>
              <ListItemText
                primary={friend.name}
                secondary={friend.lastMessage || "No messages yet"}
              />
            </Box>

            <Box display="flex" flexDirection="column" alignItems="flex-end">
              {friend.lastMessageTime && (
                <Typography variant="body2" color="text.secondary">
                  {/* {friend.lastMessageTime} */}
                      {moment(friend.lastMessageTime).fromNow()} {/* "2 hours ago", "5 minutes ago", etc. */}

                </Typography>
              )}
              {friend.unreadCount ? (
                <Box 
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    mt: 0.5
                  }}
                >
                  {friend.unreadCount}
                </Box>
              ) : null}
            </Box>
          </ListItem>)
        ))}
      </List>
    </Box>
  );
}
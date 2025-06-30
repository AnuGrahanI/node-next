'use client';
import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextareaAutosize,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import { styled } from "@mui/system";

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  resize: 'none',
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
  fontFamily: 'inherit',
  padding: '8px 12px',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
}));

interface ChatInputProps {
  onSend: (msg: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export default function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
    if (onTyping) onTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Typing indicator logic
    if (onTyping) {
      if (e.target.value.length > 0 && !isTyping) {
        setIsTyping(true);
        onTyping(true);
      } else if (e.target.value.length === 0 && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }

      // Reset typing indicator after 3 seconds of inactivity
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      typingTimeout.current = setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          onTyping(false);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        borderTop: "1px solid #ddd",
      }}
    >
      <IconButton color="primary">
        <AttachmentOutlinedIcon />
      </IconButton>

      <Box flexGrow={1} bgcolor="background.default" borderRadius={1}>
        <StyledTextarea
          minRows={1}
          maxRows={4}
          placeholder="Type a message"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </Box>

      <IconButton 
        color="primary" 
        onClick={handleSend}
        disabled={!input.trim()}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
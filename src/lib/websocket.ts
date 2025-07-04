// lib/websocket.ts
import { WebSocketServer } from 'ws';
import { Server } from 'http';

const clients = new Map<string, WebSocket>();

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, request) => {
    const userId = new URL(request.url || '', `http://${request.headers.host}`).searchParams.get('userId');
    
    if (!userId) {
      ws.close();
      return;
    }

    clients.set(userId, ws as any);
    console.log(`Client connected: ${userId}`);

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message.toString());
        console.log('Received message:', msg);

        switch (msg.type) {
          case 'chat':
            const recipient = clients.get(msg.receiverId);
            if (recipient) {
              recipient.send(JSON.stringify(msg));
            }
            break;
          case 'typing':
            const typingRecipient = clients.get(msg.receiverId);
            if (typingRecipient) {
              typingRecipient.send(JSON.stringify(msg));
            }
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
      console.log(`Client disconnected: ${userId}`);
    });
  });

  return wss;
}
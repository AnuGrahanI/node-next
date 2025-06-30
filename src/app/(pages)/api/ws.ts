// app/api/ws/route.ts
import { WebSocketServer } from 'ws';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'http';
import { Socket } from 'net';

// Extend the server type to include our WebSocket server
interface CustomServer extends Server {
  wss?: WebSocketServer;
}

// Extend the response type without overriding existing properties
interface CustomApiResponse extends NextApiResponse {
  socket: Socket & {
    server: CustomServer;
  };
}

export default function handler(req: NextApiRequest, res: CustomApiResponse) {
  if (!res.socket.server.wss) {
    console.log('Starting WebSocket server...');
    const wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    const clients = new Map();

    wss.on('connection', (ws, request) => {
      const userId = request.url?.split('userId=')[1];
      if (userId) {
        clients.set(userId, ws);
        console.log(`Client connected: ${userId}`);
      }

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
        if (userId) {
          clients.delete(userId);
          console.log(`Client disconnected: ${userId}`);
        }
      });
    });
  }

  // Handle the upgrade
  if (res.socket.server.wss) {
    res.socket.server.wss.handleUpgrade(
      req,
      req.socket,
      Buffer.alloc(0),
      (ws) => {
        res.socket.server.wss?.emit('connection', ws, req);
      }
    );
  }

  res.end();
}
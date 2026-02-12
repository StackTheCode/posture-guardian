import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import type { PostureEvent } from '../types';
import toast from 'react-hot-toast';


export const usePostureWebSocket = (username: string, token: string) => {
  const [postureData, setPostureData] = useState<PostureEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    if (!username || !token) {
      console.warn(' No username or token, skipping WebSocket connection');
      return;
    }

    console.log('Attempting WebSocket connection for user:', username);


    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log('STOMP:', str),

      onConnect: () => {
        console.log(' WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;

        toast.success('Connected to real-time updates', { duration: 2000 });

        // Subscribe to user-specific updates
        client.subscribe(`/user/queue/posture`, (message) => {
          const data = JSON.parse(message.body);
          setPostureData(data);
          console.log(' Received posture update:', data);
        });
      },

      onDisconnect: () => {
        console.log(' WebSocket disconnected');
        setIsConnected(false);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          toast.error('Connection lost. Reconnecting...', { duration: 2000 });
        }
      },

      onStompError: (frame) => {
        console.error(' STOMP error:', frame);

        toast.error('WebSocket error. Check connection.', { duration: 3000 });

      },

         onWebSocketError: (error) => {
        console.error(' WebSocket error:', error);
        
        reconnectAttempts.current++;
        
        if (reconnectAttempts.current >= maxReconnectAttempts) {
          toast.error('Unable to connect. Please refresh the page.', { 
            duration: 5000,
          });
        }
      },

      reconnectDelay:5000,
      heartbeatIncoming:4000,
      heartbeatOutgoing:4000
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [username, token]);

  return { postureData, isConnected };
};
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import type { PostureEvent } from '../types';


export const usePostureWebSocket = (username: string, token: string) => {
  const [postureData, setPostureData] = useState<PostureEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log('STOMP:', str),

      onConnect: () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);

        client.subscribe('/topic/posture-updates', (message) => {
          console.log('📢 Public topic received:', message.body);
        });
        // Subscribe to user-specific updates
        client.subscribe(`/user/queue/posture`, (message) => {
          const data = JSON.parse(message.body);
          setPostureData(data);
          console.log('📨 Received posture update:', data);
        });
      },

      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [username, token]);

  return { postureData, isConnected };
};
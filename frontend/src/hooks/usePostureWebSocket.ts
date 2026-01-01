import {Client} from '@stomp/stompjs'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import type { PostureEvent } from '../types';


export const usePostureWebSocket = (username: string, token: string) => {
  const [postureData, setPostureData] = useState<PostureEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/user/queue/posture`, (message) => {
          setPostureData(JSON.parse(message.body));
        });
      },
      
      onDisconnect: () => setIsConnected(false),
    }); 

    client.activate();
    return () =>{ 
     void   client.deactivate();
    }
  }, [username, token]);

  return { postureData, isConnected };
};
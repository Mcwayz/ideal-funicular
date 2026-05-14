import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSockets = (topic: string) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-task-updates', // Use WebSocket URL if possible
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-task-updates'),
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        client.subscribe(topic, (message) => {
          if (message.body) {
            setLastMessage(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [topic]);

  const sendMessage = useCallback((destination: string, body: any) => {
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }, [stompClient]);

  return { lastMessage, sendMessage };
};

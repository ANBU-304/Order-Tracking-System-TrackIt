// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws';

export function useNotificationWebSocket(onNotification) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket connected');
        setConnected(true);
        setError(null);

        // Subscribe to notifications topic
        client.subscribe('/topic/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received notification:', notification);
            onNotification(notification);
          } catch (err) {
            console.error('Failed to parse notification:', err);
          }
        });
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setError(frame.headers['message']);
        setConnected(false);
      },

      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [onNotification]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  return { 
    connected, 
    error, 
    disconnect, 
    reconnect 
  };
}
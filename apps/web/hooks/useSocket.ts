import { useEffect, useState, useRef } from "react";

interface UseSocketReturn {
    socket: WebSocket | null; 
    loading: boolean;
    error: Event | null; 
}

export function useSocket(): UseSocketReturn {
  
    const wsRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Event | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token'); 
        console.log("Token retrieved for WebSocket:", token ? "Exists" : "Does Not Exist");
        const backendWsUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL || "ws://localhost:8080";
        const wsUrl = token ? `${backendWsUrl}?token=${token}` : backendWsUrl; 

        console.log("Attempting to connect to WebSocket:", wsUrl);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connection established.');
            setSocket(ws);
            setLoading(false);
            setError(null);
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
        };

        ws.onclose = (event: CloseEvent) => {
            console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
            setSocket(null); 
            setLoading(false);
        };

        ws.onerror = (event: Event) => {
            console.error('WebSocket error occurred:', event);
            setError(event); 
            setLoading(false); 
            setSocket(null); 
        };

        wsRef.current = ws; 

        return () => {
            if (wsRef.current) {
                console.log('Closing WebSocket connection during cleanup.');
                if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close();
                }
                wsRef.current = null; 
            }
        };

    }, []);

    return {
        socket,
        loading,
        error
    };
}
// apps/ws-backend/src/lib/user.ts

import { WebSocket } from "ws";

export interface ConnectedUser {
    userId: string;       // UUID from User table
    ws: WebSocket;        // socket instance
    rooms: Set<string | number>;   // numeric room IDs stored as string
}

export const connectedUsers = new Map<string, ConnectedUser>();

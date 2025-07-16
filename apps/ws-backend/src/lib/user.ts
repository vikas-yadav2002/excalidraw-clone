import { WebSocket } from "ws";

interface USER {
    userId : string ,
    rooms  : string[],
    ws : WebSocket

}

export const connectedUsers : USER[] = [];
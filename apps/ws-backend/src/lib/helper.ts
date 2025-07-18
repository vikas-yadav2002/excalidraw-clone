import jwt, { decode } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocket } from 'ws'; // <--- Add this import for the 'ws' WebSocket type
import  {prismaClient}  from "@repo/db/client"
import { connectedUsers } from "./user";
export const authenticate = (token: string, socket: WebSocket) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Authenticated user:", decoded);

        if (!decoded) {
            console.log("inside not decoded")
            socket.close()
            return null;
        }
        let parsedDecoded: any;
        if (typeof decoded === 'string') {
            parsedDecoded = JSON.parse(decoded);
        } else {
            parsedDecoded = decoded;
        }

        if (!parsedDecoded) {
            console.log("inside not parseddecode")
            socket.close()
            return null;
        }

        return parsedDecoded;

    } catch (e: any) {
        console.log("error while parsing data: " + e.message);
        if (socket && typeof socket.send === 'function') { 
            socket.send("error while parsing data: " + e.message);
        } else {
            console.error("Socket is not valid or does not have a send method.");
        }
        return null;
    }
};


export async function joinRoom(roomId: string, socket: WebSocket, userId: string) {
    try {
        // 1. Validate the room
        const room = await prismaClient.room.findFirst({
            where: {
                id: Number(roomId) // Assuming room IDs in your DB are numbers
            }
        });

        if (!room) {
            socket.send(JSON.stringify({ type: "error", message: "Not a valid Room ID." }));
            return; // Exit if room is invalid
        }

        // 2. Find or create the user in our in-memory store
        let existingUser = connectedUsers.find(u => u.ws === socket);

        if (!existingUser) {
            // User not found, create a new user entry
            existingUser = {
                userId: userId, // Use the authenticated userId here
                rooms: [],
                ws: socket
            };
            connectedUsers.push(existingUser);
            console.log(`New user connected: ${userId}`);
        }

        // 3. Add the room to the user's rooms if not already present
        if (!existingUser.rooms.includes(roomId)) {
            existingUser.rooms.push(roomId);
            console.log(`User ${existingUser.userId} joined room: ${roomId}`);
            socket.send(JSON.stringify({ type: "roomJoined", roomId: roomId, message: `Successfully joined room ${roomId}` }));

            
            connectedUsers.forEach(u => {
                if (u.rooms.includes(roomId) && u.ws !== socket && u.ws.readyState === WebSocket.OPEN) {
                    u.ws.send(JSON.stringify({ type: "userJoined", roomId: roomId, userId: existingUser!.userId }));
                }
            });

        } else {
            console.log(`User ${existingUser.userId} is already in room: ${roomId}`);
            socket.send(JSON.stringify({ type: "info", message: `You are already in room ${roomId}.` }));
        }

    } catch (error: any) {
        console.error("Error joining room:", error);
        socket.send(JSON.stringify({ type: "error", message: `Error joining room: ${error.message}` }));
    }
}

export async function createRoom(roomName: string, socket: WebSocket, userId: string) {
    try {
        if (!roomName || roomName.trim() === '') {
            socket.send(JSON.stringify({ type: "error", message: "Room name cannot be empty." }));
            return;
        }

        // 0 check if it already exist 
        const existingRoom = await prismaClient.room.findFirst({
            where :{
                slug : roomName
            }
        })

        if(existingRoom){
            socket.send(`The room with room Name : ${roomName} already exist`);
            return
        }

        // 1. Create the room in the database
        const newRoom = await prismaClient.room.create({
            data: {
                slug: roomName,
                adminId: userId,
            },
        });

        console.log(`User ${userId} created new room: ${newRoom.slug} (ID: ${newRoom.id})`);
        socket.send(JSON.stringify({ type: "roomCreated", roomId: newRoom.id.toString(), roomName: newRoom.slug, message: `Room '${newRoom.slug}' created successfully.` }));

        await joinRoom(newRoom.id.toString(), socket, userId);

    } catch (error: any) {
        console.error("Error creating room:", error);
        socket.send(JSON.stringify({ type: "error", message: `Error creating room: ${error.message}` }));
    }
}



export async function leaveRoom(roomId: string, socket: WebSocket, userId: string) {
    try {
        // 1. Find the user in our in-memory store
        const existingUser = connectedUsers.find(u => u.ws === socket);

        if (!existingUser) {
            socket.send(JSON.stringify({ type: "error", message: "User not found in active connections." }));
            return;
        }

        // 2. Check if the user is actually in the room
        const roomIndex = existingUser.rooms.indexOf(roomId);
        if (roomIndex === -1) {
            socket.send(JSON.stringify({ type: "info", message: `You are not in room ${roomId}.` }));
            return;
        }

        // 3. Remove the room from the user's rooms list
        existingUser.rooms.splice(roomIndex, 1);
        console.log(`User ${userId} left room: ${roomId}`);
        socket.send(JSON.stringify({ type: "roomLeft", roomId: roomId, message: `Successfully left room ${roomId}.` }));

        // Optional: Notify other users in the room that someone left
        connectedUsers.forEach(u => {
            if (u.rooms.includes(roomId) && u.ws !== socket && u.ws.readyState === WebSocket.OPEN) {
                u.ws.send(JSON.stringify({ type: "userLeft", roomId: roomId, userId: existingUser.userId }));
            }
        });

    } catch (error: any) {
        console.error("Error leaving room:", error);
        socket.send(JSON.stringify({ type: "error", message: `Error leaving room: ${error.message}` }));
    }
}


export async function handleChat(roomId: string, messageContent: string, socket: WebSocket, userId: string) {
    try {
        if (!messageContent || messageContent.trim() === '') {
            socket.send(JSON.stringify({ type: "error", message: "Chat message cannot be empty." }));
            return;
        }

        // 1. Find the sender in our in-memory store
        const sender = connectedUsers.find(u => u.ws === socket);

        if (!sender) {
            socket.send(JSON.stringify({ type: "error", message: "Sender not found in active connections." }));
            return;
        }

        // 2. Verify the sender is actually in the room they are trying to chat in
        if (!sender.rooms.includes(roomId)) {
            socket.send(JSON.stringify({ type: "error", message: `You are not in room ${roomId} to send messages.` }));
            return;
        }

        // Optional: Save message to database (e.g., for chat history)
        await prismaClient.chat.create({
            data: {
                roomId: Number(roomId),
                userId: userId,
                message: messageContent,
            }
        });

        // 3. Broadcast the message to all users in that room
        const chatMessage = {
            type: "chat",
            roomId: roomId,
            senderId: userId,
            message: messageContent,
            timestamp: new Date().toISOString() // Add a timestamp
        };

        connectedUsers.forEach(u => {
            if (u.rooms.includes(roomId) && u.ws.readyState === WebSocket.OPEN) {
                // Send to everyone in the room, including the sender
                u.ws.send(JSON.stringify(chatMessage));
            }
        });

        console.log(`Chat message from ${userId} in room ${roomId}: "${messageContent}"`);

    } catch (error: any) {
        console.error("Error handling chat message:", error);
        socket.send(JSON.stringify({ type: "error", message: `Error sending message: ${error.message}` }));
    }
}
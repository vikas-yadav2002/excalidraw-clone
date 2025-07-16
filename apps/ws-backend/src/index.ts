import { WebSocketServer } from "ws";
import { authenticate, createRoom, handleChat, joinRoom, leaveRoom } from "./lib/helper";
import { connectedUsers } from "./lib/user";
const wss = new WebSocketServer({ port: 8080 });


wss.on("connection", (socket, request) => {

  const url = new URL(request.url || "", `http://${request.headers.host}`);

  if (!url) {
    socket.close();
    return;
  }
  const token = url.searchParams.get("token");

  if (!token) {
    socket.send(JSON.stringify({ error: "Authentication token missing." }));
    socket.close();
    return;
  }

  try {
    const parsedDecoded = authenticate(token, socket);
    if(!parsedDecoded){
        socket.close();
        return
    }
    connectedUsers.push({
        userId : parsedDecoded.id,
        rooms : [],
        ws : socket
    })
    socket.send(
      JSON.stringify({
        message: "Hello from websocket server! You are authenticated.",
      })
    );

    socket.on("message", async (data) => {
      const DataString = data.toString();
        try {
            const parsedData = JSON.parse(DataString);
            let userId: string | null = null;
            if (parsedData) { 
                console.log(parsedData);
            } else {
                socket.send(JSON.stringify({ type: 'error', message: 'Authentication token required.' }));
                return;
            }
        

       switch (parsedData.type) {
                case 'join-room':
                    if (parsedData.roomId) {
                        await joinRoom(parsedData.roomId, socket, parsedDecoded.id);
                    } else {
                        socket.send(JSON.stringify({ type: 'error', message: 'roomId is required for join-room.' }));
                    }
                    break;

                // case 'create-room':
                //     // Ensure roomName is provided
                //     if (parsedData.roomName) {
                //         await createRoom(parsedData.roomName, socket, parsedDecoded.id);
                //     } else {
                //         socket.send(JSON.stringify({ type: 'error', message: 'roomName is required for create-room.' }));
                //     }
                //     break;

                case 'leave-room':
                    // Ensure roomId is provided
                    if (parsedData.roomId) {
                        await leaveRoom(parsedData.roomId, socket, parsedDecoded.id);
                    } else {
                        socket.send(JSON.stringify({ type: 'error', message: 'roomId is required for leave-room.' }));
                    }
                    break;

                case 'chat':
                    // Ensure roomId and message are provided
                    if (parsedData.roomId && parsedData.message) {
                        await handleChat(parsedData.roomId, parsedData.message, socket, parsedDecoded.id);
                    } else {
                        socket.send(JSON.stringify({ type: 'error', message: 'roomId and message are required for chat.' }));
                    }
                    break;

                default:
                    socket.send(JSON.stringify({ type: 'error', message: 'Unknown message type.' }));
                    break;
            }
        }catch(e : any){
            console.log("error inside message sending" + e.message)
        }

    });

    socket.on("close", () => {
      console.log(`Connection closed for user: ${parsedDecoded}`);
    });

    socket.on("error", (error) => {
      console.error(`WebSocket error for user :`, error);
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    socket.send(
      JSON.stringify({
        error: "Authentication failed: Invalid or expired token.",
      })
    );
    socket.close();
    return;
  }
});

console.log("WebSocket server started on port 8080");

// Example of how to generate a JWT for testing (in a separate script or part of your auth service)
// const testUser = { id: 123, username: "testuser" };
// const testToken = jwt.sign(testUser, JWT_SECRET, { expiresIn: '1h' });
// console.log("Test JWT:", testToken);
// // Use this token in your WebSocket client: ws://localhost:8080?token=YOUR_GENERATED_TOKEN

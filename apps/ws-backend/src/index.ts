import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken"; // Corrected import for jsonwebtoken

import {JWT_SECRET} from "@repo/backend-common/config"

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`); // Create a URL object for easier parsing

    if (!url) {
        socket.close();
        return;
    }

    // Extract the token from the URL query parameters (e.g., ws://localhost:8080?token=YOUR_JWT_TOKEN)
    const token = url.searchParams.get('token');

    if (!token) {
        socket.send(JSON.stringify({ error: "Authentication token missing." }));
        socket.close();
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Authenticated user:", decoded);

        socket.send(JSON.stringify({ message: "Hello from websocket server! You are authenticated." }));

        socket.on("message", (data) => {
            console.log(`Received message from : ${data.toString()}`);
            // Echo the message back, or process it based on your application logic
            socket.send(`You said: ${data.toString()}`);
        });

        socket.on("close", () => {
            console.log(`Connection closed for user: `);
        });

        socket.on("error", (error) => {
            console.error(`WebSocket error for user :`, error);
        });

    } catch (error) {
        console.error("JWT verification failed:", error);
        socket.send(JSON.stringify({ error: "Authentication failed: Invalid or expired token." }));
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
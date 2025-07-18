import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { parse } from "path";

export const ChatRoomClient = ({
  messages: initialMessages,
  roomSlug,
  roomId,
  userId
}: {
  messages: string[];
  roomSlug: string;
  roomId: string;
  userId:string
}) => {
  const { socket, loading, error } = useSocket();
  // console.log(roomId);
  const [chat, setChat] = useState<string[]>(initialMessages);
  const [messageInput, setMessageInput] = useState("");
  console.log("Client Props =>", { roomId, roomSlug, userId, initialMessages });


  useEffect(() => {
    setChat(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (loading || !socket || !roomId || !roomSlug) return;
    console.log(`Sending join-room to roomId: ${roomId} & ${roomSlug}`);
    socket.send(
      JSON.stringify({
        type: "join-room",
        roomId: roomId,
      })
    );

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(`Sending leave-room from roomId: ${roomSlug}`);
        socket.send(
          JSON.stringify({
            type: "leave-room",
            roomId: roomId,
          })
        );
      }
    };
  }, [socket, loading, roomSlug , roomId]);
  //to catch message event
  useEffect(() => {
    if (loading || !socket) {
      return;
    }

    socket.onmessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data);
        alert(parsedData.message);
        // console.log(parsedData.message);
        if (parsedData.type === "chat" && parsedData.message) {
          setChat((c) => [...c, parsedData.message]);
        } else if (parsedData.type === "roomJoined") {
        } else {
          console.warn(
            "Received unknown or malformed message type:",
            parsedData
          );
        }
      } catch (e) {
        console.error(
          "Error parsing incoming WebSocket message:",
          e,
          event.data
        );
      }
    };

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket, loading]);

  const sendMessage = () => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      messageInput.trim() !== ""
    ) {
      const messageToSend = {
        type: "chat",
        roomId: roomId,
        message: messageInput.trim(),
      };
      // console.log("Sending message:", messageToSend);
      socket.send(JSON.stringify(messageToSend));
      setMessageInput("");
    } else {
      console.warn("WebSocket not open or message is empty, cannot send.");
      if (error) {
        console.error("WebSocket error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 text-center py-4">
        Connecting to chat...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error connecting to chat: {error.type}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto border border-gray-700">
      <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
        Chat Room: {roomSlug}
      </h2>

      <div className="border border-gray-700 rounded-lg h-80 overflow-y-auto p-4 mb-4 bg-gray-900 text-gray-200">
        {chat.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet.</p>
        ) : (
          <ul className="list-none p-0">
            {chat.map((msg, index) => (
              <li
                key={index}
                className={`mb-2 p-2 rounded-md ${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-800" // Alternating backgrounds
                }`}
              >
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-grow py-3 px-4 rounded-lg border border-gray-700 bg-gray-800 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold border-none cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

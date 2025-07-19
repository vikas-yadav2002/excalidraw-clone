
"use client"

import { useEffect, useRef, useState } from "react";
import { HTTP_BACKEND_URL } from "../config/links";
import axios from "axios";
import CanvasPage from "../app/canvas/[room]/page";
import { Canvas } from "./Canvas";


async function getRoomID(roomSlug: string) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${HTTP_BACKEND_URL}/chats/chat/${roomSlug}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return [];
  }
}

export function RoomCanvas({ roomSlug }: { roomSlug: string }) {
  const [roomId, setRoomId] = useState("2");
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getRoomID(roomSlug);
      setRoomId(response.roomId);
    };

    fetchMessages();
  }, [roomSlug]);

  return <Canvas roomSlug={roomSlug} roomId={roomId}/>
  
}

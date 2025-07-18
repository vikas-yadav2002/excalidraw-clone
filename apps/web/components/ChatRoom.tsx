"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { ChatRoomClient } from "./ChatRoomClient";
import { HTTP_BACKEND_URL } from "../config/links";
 async function getChatMessages(roomSlug: string) {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(
            `${HTTP_BACKEND_URL}/chats/chat/${roomSlug}`, 
            { // Axios config object
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data

    } catch (error) {
        console.error("Failed to fetch chat messages:", error);
        return []; 
    }
}

 
export const ChatRoom =({roomSlug}:{roomSlug : string})=>{
  const [message , setMessages]  = useState<string[]>([])
  const [roomId , setRoomId ]   = useState()
 
        useEffect(() => {
            const fetchMessages = async () => {
                const response = await getChatMessages(roomSlug);
                setRoomId(response.roomId);
                 const extractedMessages = response.message.map((chat:any) => chat.message);
                
            setMessages(extractedMessages);
            };
    
            fetchMessages();
        }, [roomSlug]); 


        return (

            <ChatRoomClient userId="vik" messages={message} roomId={roomId || ""} roomSlug={roomSlug}/>
        )
    
}

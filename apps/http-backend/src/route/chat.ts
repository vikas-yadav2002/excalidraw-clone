import { Router } from "express";
import { chat, getChatsByRoomId, getRoomBySlug } from "../controllers/chatController";


const chatRouter :Router = Router();

chatRouter.get("/chat/:roomSlug" , getRoomBySlug )
chatRouter.get("/room/:roomId" , getChatsByRoomId)

export default chatRouter;
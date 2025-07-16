import { Router } from "express";
import { chat } from "../controllers/chatController";


const chatRouter :Router = Router();

chatRouter.get("/chat/:id" , chat )


export default chatRouter;
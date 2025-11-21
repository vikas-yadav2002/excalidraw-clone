import { Router } from "express";
import { createRoom , checkRoomSlug } from "../controllers/roomController";
import authenticate from "../middleware/authmiddleware";

const roomRouter: Router = Router();

// Create new room
roomRouter.post("/create-room",authenticate, createRoom);

// Check if room exists
roomRouter.get("/check-room", checkRoomSlug);

export default roomRouter;

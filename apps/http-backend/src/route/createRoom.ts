import { Router } from "express";
import { createRoom } from "../controllers/roomController";



const roomRouter :Router = Router();

roomRouter.post('/create-room' , createRoom )


// Export the router
export default roomRouter;
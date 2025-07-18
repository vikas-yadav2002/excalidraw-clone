import { Router } from "express";
import { signin, signup } from "../controllers/authController";


const authrouter :Router = Router();

// routes
authrouter.post('/signin', signin); 
authrouter.post('/signup', signup);

// Export the router
export default authrouter;
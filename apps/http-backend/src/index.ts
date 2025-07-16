import  express  from "express";
import authrouter from "./route/auth";
import roomRouter from "./route/createRoom";
import authenticate from "./middleware/authmiddleware";
import chatRouter from "./route/chat";
const app = express();
app.use(express.json());

app.use('/api/v1/auth' , authrouter)
app.use('/api/v1/room' , authenticate ,roomRouter)
app.use('/api/v1/chats' ,authenticate , chatRouter)




app.listen(3003 , ()=>{
    console.log("HTTP backend started at 3003")
})
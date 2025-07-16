import { Request, Response } from "express";

interface ChatRequest extends Request {
    user? :{
   
    },
    params: {
        id: string;
    };
}


export const chat = async(req : ChatRequest , res : Response)=>{
    // console.log(req.user)
    const chatId = Number(req.params.id);
    console.log(chatId)
    if (!chatId) {
        return res.json({
            message : "chat id is not present in the url"
        })
    }



    return res.json({
        type : typeof(chatId) ,
        id : chatId,
        user : req.user
    })
}
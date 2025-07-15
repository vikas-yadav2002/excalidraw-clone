import { Request , Response  , NextFunction} from "express"

const authenticate = async(req : Request , res: Response , next : NextFunction)=>{
      console.log("middleware called")
      next();
}

export default authenticate;
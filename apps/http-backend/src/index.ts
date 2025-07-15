import  express  from "express";

const app = express();
app.use(express.json());


app.listen(3003 , ()=>{
    console.log("HTTP backend started at 3003")
})
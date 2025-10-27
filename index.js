import express from "express"
import dotenv from "dotenv"
import userRouter from "./route/userRoute.js"
import connectDb from "./config/db.js"
import cors from 'cors'
dotenv.config()


const app =express()
const port=process.env.PORT
connectDb()



app.use(cors())
app.use(express.json())
app.use('/api/user',userRouter)


app.get('/',(req,res )=>{
    res.send("server is running fine !!")
})




app.listen(port,(req,res )=>{
    console.log(`the server is listning on  port ${port}`);
    
})
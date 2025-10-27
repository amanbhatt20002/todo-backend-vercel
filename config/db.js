import mongoose from "mongoose";


const connectDb=async()=>{

  try {
      await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`)
        console.log("DB CONNECTED");
            
    
  } catch (error) {
    console.error("mongoDb connection error: ",error);
    
    
  }
}




export default connectDb
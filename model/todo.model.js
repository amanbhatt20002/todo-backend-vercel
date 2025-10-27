import mongoose from "mongoose";

const todoSchema= new mongoose.Schema({

    title:{
        type:String,
        reuired:true

    },
     completed:{
        type:Boolean,
        default:false
        

    },
     createdAt:{
        type:Date,
        default:Date.now,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }


})

export const Todo =mongoose.model("Todo",todoSchema)
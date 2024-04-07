import mongoose from "mongoose";
const productSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
    type:Number,
    required:true
    },
    Quantity:{
        type:Number,
        required:true
    },
    shipping:{
     type:Boolean
    },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    }    
},{timeStamps:true})

export default mongoose.model('Products',productSchema)


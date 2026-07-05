import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URL;
if(!MONGODB_URI){
    throw new Error ("Please use correct url for mongodb");
}
let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
}
export const ConnectToDB = async() =>{
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts = {bufferCommands:false};
        cached.promise = mongoose.connect(MONGODB_URI,opts).then((mongoose)=>mongoose);
    }
    try{
        cached.conn = await cached.promise;
        return cached.conn
    }catch(error){
        cached.promise = null;
        throw error
    }
}
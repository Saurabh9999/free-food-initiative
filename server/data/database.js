import mongoose from "mongoose"

console.log(process.env.MONGO_URL)


const connectdb = () =>{ mongoose.connect(process.env.MONGO_URL,{
  dbName: "kichdicom",
 })
 .then(()=>console.log("Database connected"))
 .catch((e)=>console.log(e));
 };
 
 export default connectdb;

//  mongodb://localhost:27017/
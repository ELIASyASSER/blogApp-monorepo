import mongoose from "mongoose"
let connection = {}
export const connectToDb = async()=>{

    try {
        if(connection.isConnected){
            console.log("you are already connected")
            return 
        }
        const db =await mongoose.connect(process.env.MONGO) 
        connection.isConnected = db.connections[0].readyState
        console.log('connected to db')
    } catch (error) {
        console.log(error.message)
        throw new Error("error connecting the database",error.message)
    }

}
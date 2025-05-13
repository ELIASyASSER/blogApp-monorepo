import jwt from "jsonwebtoken"
import { connectToDb } from "@/lib/utils"
import { userModel } from "@/models/user";
import { cookies } from "next/headers";

export const POST = async(req)=>{

    try {
        // connect to mongodb
        await connectToDb()
        // login logic here

        const { username, password } = await req.json();
 
        if (!username || !password) {
            return new Response(JSON.stringify({message:"Missing Credintials"}),{status:400});
        }
    
            const user = await userModel.findOne({ username });
            if (!user) {
                return new Response(JSON.stringify({message:"invalid username"}),{status:401});
            }
    
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
            return new Response(JSON.stringify({message:"invalid password"}),{status:401});

            }   
    
            const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET,{expiresIn:'7d'});
            cookies().set("token",token,{
                httpOnly:true,
                sameSite:process.env.NODE_ENV=="production"?"none":"lax",
                secure:process.env.NODE_ENV=="production",
                path:"/",
            })
            return new Response(JSON.stringify({message:"Logged In Successfully"}),{status:201});

    } catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify({ message: "Something went wrong"+ error.message}), {
          status: 500,
    })
    
    }

}
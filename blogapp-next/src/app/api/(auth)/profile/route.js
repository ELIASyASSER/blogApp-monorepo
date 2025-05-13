import { authMiddleware } from "@/middleware/auth";

export const GET = async(req)=>{
        // get user profile here
    try {
        const data =  authMiddleware()

        return new Response(JSON.stringify({data}),{status:200});

    } catch (error) {
        console.error("invalid login", error);
        return new Response(JSON.stringify({ message: "Something went wrong: " + error.message }), { status: 500 });
    }

}


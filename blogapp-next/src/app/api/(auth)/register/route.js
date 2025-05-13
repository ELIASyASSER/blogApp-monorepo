import { connectToDb } from "@/lib/utils"
import { userModel } from "@/models/user";

export const POST = async (req) => {
  try {
    await connectToDb();

    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ message: "Username and password are required" }), { status: 400 });
    }

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Username already taken" }), { status: 401 });
    }

    const userData = await userModel.create({ username, password });

    // Exclude password before sending
    const { password: _, ...safeUser } = userData._doc;

    return new Response(JSON.stringify({ data: safeUser }), { status: 201 });

  } catch (error) {
    console.error("signup error:", error);
    return new Response(JSON.stringify({ message: "Something went wrong: " + error.message }), { status: 500 });
  }
};

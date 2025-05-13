import { cookies } from "next/headers";

export const POST = async () => {
  // Clear the token cookie by setting it to empty and expired
  cookies().set("token", "", {
    httpOnly: true,
    expires: new Date(0), // expires the cookie
    sameSite:process.env.NODE_ENV=="production"?"none":"lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
};

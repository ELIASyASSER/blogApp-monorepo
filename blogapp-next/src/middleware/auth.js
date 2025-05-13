import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
// authMiddleware.ts
export function authMiddleware() {
  const tokenCookie = cookies().get("token");
  if (!tokenCookie) throw new Error("NO_TOKEN please login first");

  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw new Error("TOKEN_EXPIRED login again ");
    throw new Error("INVALID_TOKEN pleae login first");
  }
}

import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();           // Get all cookies from the request
  const token = cookieStore.get('token').value;  // Try to get the 'token' cookie
  const logged = !!token;                  // Convert existence of token to true/false

  return Response.json({ logged });        // Return a JSON response
}

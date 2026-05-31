import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

export async function verifyAdmin(request) {
  let token = null;
  
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("admin_token")?.value;
  } catch (e) {
    const cookieHeader = request?.headers?.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    return { success: false, status: 401, error: "Unauthorized - No token" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return { success: false, status: 403, error: "Forbidden - Not an admin" };
    }
    return { success: true, admin: decoded };
  } catch (error) {
    return { success: false, status: 401, error: "Unauthorized - Invalid token" };
  }
}

export { JWT_SECRET };

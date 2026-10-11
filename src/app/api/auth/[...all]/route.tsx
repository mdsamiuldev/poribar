import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
//KhbhfPZ9eCfPCW1J
//samiul122344_db_user
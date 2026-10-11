import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./db";

// MongoDB ডাটাবেজের নাম আপনার পছন্দমতো দিতে পারেন (যেমন: event-db)
const db = (await clientPromise).db("event-db"); 

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {  
    enabled: true,  
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    },
  },
});
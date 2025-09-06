"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week
const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret"
);

// --- Create JWT session cookie ---
export async function createLoginSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// --- Verify JWT session cookie ---
export async function getLoginSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { username: string };
  } catch {
    return null;
  }
}

// --- Destroy cookie on logout ---
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
interface Chat {
  id: number;
  created_at: string;
  session_id: string;
  userinput: string;
  aioutput: string;
}
export const fetchAllChats = async (): Promise<Chat[]> => {
  try {
    const response = await fetch(
      `https://erdvvmbeegpjpwkrhljo.supabase.co/rest/v1/chatlogs?order=id.desc`,
      {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZHZ2bWJlZWdwanB3a3JobGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI5MDc1NCwiZXhwIjoyMDcxODY2NzU0fQ.mwX6jsrQHBnDuv1ZkxmJEMTs7tR6aRuv6OMATkn-DSo",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZHZ2bWJlZWdwanB3a3JobGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI5MDc1NCwiZXhwIjoyMDcxODY2NzU0fQ.mwX6jsrQHBnDuv1ZkxmJEMTs7tR6aRuv6OMATkn-DSo",
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch chats: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in fetchChats:", error);
    return [];
  }
};

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("JWT decrypt error:", error)
    return null
  }
}

export async function getSession() {
  try {
    const session = cookies().get("session")?.value
    if (!session) return null
    return await decrypt(session)
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

export async function createSession(userId: number, email: string, role = "user") {
  try {
    const session = await encrypt({ userId, email, role })
    cookies().set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Create session error:", error)
    throw error
  }
}

export async function deleteSession() {
  try {
    cookies().delete("session")
  } catch (error) {
    console.error("Delete session error:", error)
  }
}

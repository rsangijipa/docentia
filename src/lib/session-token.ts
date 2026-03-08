import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "docentia_jwt_secret_key_2026_premium";
const key = new TextEncoder().encode(secretKey);

export const SESSION_NAME = "docentia-session";

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

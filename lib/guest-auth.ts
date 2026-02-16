import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "solmare-guest-secret-key-change-me"
);

export async function createGuestToken(propertyId: string): Promise<string> {
  // Create a token valid for a short duration (e.g., 5 minutes for browsing session)
  // If the user wants strictly "type pin on refresh", we can make it shorter or handle it on client.
  // But standard session usually lasts a bit.
  // Given user feedback: "after every time I refreshing... I am not getting a prompt"
  // They want prompt on refresh.
  // So we don't persist it. URL token is the way.

  return await new SignJWT({ propertyId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token valid for 24h BUT...
    .sign(JWT_SECRET);
}

export async function verifyGuestToken(token: string, propertyId: string): Promise<boolean> {
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.propertyId === propertyId;
  } catch (err) {
    return false;
  }
}

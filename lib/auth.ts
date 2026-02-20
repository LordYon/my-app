import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const BCRYPT_ROUNDS = 12;

export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

// In-memory store — replace with a real DB in production
const users = new Map<string, User>();

export async function createUser(email: string, password: string): Promise<User> {
  if (users.has(email)) {
    throw new Error("Email already registered");
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user: User = { id: crypto.randomUUID(), email, passwordHash };
  users.set(email, user);
  return user;
}

export async function verifyUser(email: string, password: string): Promise<User> {
  const user = users.get(email);
  if (!user) throw new Error("Invalid email or password");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");
  return user;
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}

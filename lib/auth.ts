import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export type User = {
  id: string;
  email: string;
  passwordHash?: string; // Optional — OAuth users have no password
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
  if (!user || !user.passwordHash) throw new Error("Invalid email or password");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");
  return user;
}

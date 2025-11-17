import { connectDB } from "@/lib/db";
import { comparePassword, hashPassword } from "@/lib/auth";
import type { RegisterInput } from "@/lib/validators";
import User, { type IUser, type UserRole } from "@/models/User";

export async function findUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email }).lean();
}

export async function createUser(payload: RegisterInput, role: UserRole = "STUDENT") {
  await connectDB();
  const hashedPassword = await hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: hashedPassword,
    role,
  });
  return user;
}

export async function validateUser(email: string, password: string) {
  await connectDB();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.warn("[auth] user not found for email", normalizedEmail);
    return null;
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    console.warn("[auth] invalid password for", normalizedEmail);
  }
  return isValid ? user : null;
}

export async function listUsers() {
  await connectDB();
  return User.find().sort({ createdAt: -1 }).lean();
}

export async function updateUserRole(userId: string, role: UserRole) {
  await connectDB();
  return User.findByIdAndUpdate(userId, { role }, { new: true }).lean();
}


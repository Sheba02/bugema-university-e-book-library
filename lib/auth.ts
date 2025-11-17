import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import User, { type IUser, type UserRole } from "@/models/User";

const ACCESS_TOKEN_COOKIE = "bu_access_token";
const REFRESH_TOKEN_COOKIE = "bu_refresh_token";
const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_ACCESS_SECRET");
  }
  return secret;
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_REFRESH_SECRET");
  }
  return secret;
}

export function toSessionUser(user: IUser): SessionUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: SessionUser) {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload: SessionUser) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getAccessSecret()) as SessionUser & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getRefreshSecret()) as SessionUser &
    jwt.JwtPayload;
}

export function setAuthCookies(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = cookies();
  const domain = process.env.COOKIE_DOMAIN;

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour default
    domain,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days default
    domain,
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();
  const domain = process.env.COOKIE_DOMAIN;
  cookieStore.delete({ name: ACCESS_TOKEN_COOKIE, path: "/", domain });
  cookieStore.delete({ name: REFRESH_TOKEN_COOKIE, path: "/", domain });
}

export async function issueTokens(user: IUser) {
  const sessionUser = toSessionUser(user);
  return {
    sessionUser,
    accessToken: signAccessToken(sessionUser),
    refreshToken: signRefreshToken(sessionUser),
  };
}

export async function getSessionUserFromRequest(
  request?: NextRequest,
): Promise<SessionUser | null> {
  const token = getTokenFromRequest(ACCESS_TOKEN_COOKIE, request);
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(
  name: string,
  request?: NextRequest,
): string | null {
  if (request) {
    return request.cookies.get(name)?.value || null;
  }
  return cookies().get(name)?.value ?? null;
}

export async function refreshSessionFromRequest(request: NextRequest) {
  const refreshToken = getTokenFromRequest(REFRESH_TOKEN_COOKIE, request);
  if (!refreshToken) {
    return null;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) {
      return null;
    }

    const tokens = await issueTokens(user);
    const responseHeaders = new Headers();

    responseHeaders.append(
      "Set-Cookie",
      `${ACCESS_TOKEN_COOKIE}=${tokens.accessToken}; HttpOnly; Path=/; SameSite=Lax`,
    );
    responseHeaders.append(
      "Set-Cookie",
      `${REFRESH_TOKEN_COOKIE}=${tokens.refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
    );

    return { tokens, headers: responseHeaders };
  } catch (error) {
    console.error("Refresh token error", error);
    return null;
  }
}

export async function requireSessionUser(req?: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function fetchServerUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    await connectDB();
    const user = await User.findById(payload.id);
    return user ? toSessionUser(user) : null;
  } catch {
    return null;
  }
}

export function readAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const [, token] = authHeader.split(" ");
  return token || null;
}


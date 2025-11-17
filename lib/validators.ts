import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const bookPageSchema = z.union([
  z.string().url(),
  z
    .string()
    .regex(/^(\/)?books\/[a-zA-Z0-9-_]+\/\d+\.jpg$/, {
      message: "Use /books/<folder>/<page>.jpg",
    }),
]);

export const bookSchema = z.object({
  title: z.string().min(2).max(180),
  description: z.string().min(10).max(500).optional(),
  category: z.string().min(2).max(80),
  folder: z.string().min(1),
  pages: z.array(bookPageSchema),
  coverImage: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export const progressSchema = z.object({
  bookId: z.string(),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(1),
});

export const categorySchema = z.object({
  currentName: z.string().optional(),
  newName: z.string().min(2).max(80),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;


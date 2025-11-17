import { Schema, model, models, type Model, type Document } from "mongoose";

export type UserRole = "ADMIN" | "STUDENT";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      default: "STUDENT",
    },
  },
  { timestamps: true },
);

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);
export default User;


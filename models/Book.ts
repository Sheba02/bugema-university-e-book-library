import {
  Schema,
  model,
  models,
  type Model,
  type Document,
  type Types,
} from "mongoose";

export interface IBook extends Document {
  title: string;
  description?: string;
  category: string;
  folder: string;
  pages: string[];
  coverImage?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true, trim: true },
    folder: { type: String, required: true },
    pages: [{ type: String, required: true }],
    coverImage: { type: String },
    isVisible: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

BookSchema.index({ title: "text", description: "text", category: "text" });

const Book: Model<IBook> = models.Book || model<IBook>("Book", BookSchema);
export default Book;


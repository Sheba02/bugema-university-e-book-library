import {
  Schema,
  model,
  models,
  type Document,
  type Model,
} from "mongoose";

export interface IReadingProgress extends Document {
  user: Schema.Types.ObjectId;
  book: Schema.Types.ObjectId;
  currentPage: number;
  totalPages: number;
  completed: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ReadingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

const ReadingProgress: Model<IReadingProgress> =
  models.ReadingProgress ||
  model<IReadingProgress>("ReadingProgress", ReadingProgressSchema);

export default ReadingProgress;


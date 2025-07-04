// models/Post.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}
export interface IPopulatedComment {
  _id: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
}

export interface IPost extends Document {
  user: mongoose.Types.ObjectId; // author
  text?: string;
  images: string[]; // Cloudinary URLs
  likes: mongoose.Types.ObjectId[];
  comments: IComment[]; // Add this line
}

const PostSchema: Schema<IPost> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    images: { type: [String], default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
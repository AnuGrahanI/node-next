// models/Post.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;   // author
  text?: string;
  images: string[];               // Cloudinary URLs
  likes: mongoose.Types.ObjectId[]; // users who liked
}

const PostSchema: Schema<IPost> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    images: { type: [String], default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;

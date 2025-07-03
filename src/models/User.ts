import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  fname?: string;
  lname?: string;
  name?: string;
  email: string;
  username?: string;
  password: string;
  image?: string;
  coverimage?: string;
  bio?: string;
  friends?: IUser[];
  requests?: IUser[];
  sentFriendRequests?: IUser[];
  receivedFriendRequests?: IUser[];
  posts?: mongoose.Types.ObjectId[];
}


const UserSchema: Schema<IUser> = new Schema(
  {
    fname: String,
    lname: String,
    name: String,
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    coverimage: String,
    bio: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    sentFriendRequests: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    receivedFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],


  },
  { timestamps: true }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

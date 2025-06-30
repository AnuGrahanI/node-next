import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  image?: string
  friends?: IUser[];
  requests?: IUser[];
  sentFriendRequests?: IUser[];
  receivedFriendRequests?: IUser[]
}


const UserSchema: Schema<IUser> = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    sentFriendRequests: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },

    receivedFriendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

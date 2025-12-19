import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// This tells TypeScript what a User object looks like
export interface IUser {
  email: string;
  password: string;
  name?: string;
  profilePhoto?: string;
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Creating a schema = structure of how User will be saved in MongoDB
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    profilePhoto: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// This function runs before saving the user to the database : to perform operations on that object before send to database
// It hashes (encrypts) the password so the real password is never stored
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Prevent model re-creation error in Next.js (Hot Reload)
// If model exists, use it. Otherwise create new.
const User = models?.User || model<IUser>("User", userSchema);

export default User;

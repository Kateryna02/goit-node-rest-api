
import {Schema, model} from "mongoose";
import {handleSaveError}  from "../models/hooks.js"


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
  },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
     
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleSaveError);

const User = model("user", userSchema);

export default User;

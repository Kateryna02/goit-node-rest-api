


import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import wrapper from "../decorator/wraper.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";

const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "200", d: "retro" }, true);
  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });
  res.json({
    token,
  });
};

const getCurrent = (req, res) => {
  const { username, email } = req.user;
  res.json({
    username,
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsDir, filename);
    await fs.rename(oldPath, newPath); 
    const avatarURL = `/avatars/${filename}`; 

    await authServices.updateUser({ _id }, { avatarURL });

    res.status(200).json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup: wrapper(signup),
  signin: wrapper(signin),
  getCurrent: wrapper(getCurrent),
  signout: wrapper(signout),
  updateAvatar: wrapper(updateAvatar),
};

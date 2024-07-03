


import bcrypt from "bcrypt";
import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import wrapper from "../decorator/wraper.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import sendEmail from "../helpers/sendEmail.js";
import User from "../models/User.js";
import { nanoid } from 'nanoid';


const avatarsDir = path.resolve("public", "avatars");


const { BASE_URL } = process.env;

const generateVerificationToken = () => {
  return nanoid(); 
};

const signup = async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'Email already in use' });

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar.url(email, { s: '200', d: 'retro' }, true),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify Your Email Address',
    body: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  try {
      await sendEmail(verifyEmail);
  } catch (error) {
      console.error('Failed to send verification email:', error.message);
      return res.status(500).json({ message: 'Failed to send verification email' });
  }

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) return res.status(400).json({ message: 'Verification token is required' });

  const user = await User.findOne({ verificationToken });
  if (!user) return res.status(404).json({ message: 'Not Found' });

  user.verificationToken = null;
  user.verify = true;
  await user.save();

  res.status(200).json({ message: 'Verification successful. You can now log in.' });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    body: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
  await user.save();

  res.json({
    message: "Verify email sent successfully",
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
  if(!user.verifyEmail) {
    throw HttpError(401, "Email not verified");
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
  verifyEmail,
  resendEmail,
};

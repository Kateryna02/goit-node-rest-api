

import express from "express";
import isEmptyBody from "../midalwars/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import { authSignupSchema, authSigninSchema , authEmailSchema } from "../schemas/authSchemas.js";
import authenticate from "../midalwars/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, validateBody(authSignupSchema), authControllers.signup);
authRouter.post("/signin", isEmptyBody, validateBody(authSigninSchema), authControllers.signin);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.post("/signout", authenticate, authControllers.signout);
authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);
authRouter.post("/verify",isEmptyBody, validateBody(authEmailSchema), authControllers.resendEmail);
export default authRouter;

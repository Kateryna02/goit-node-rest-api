import express from "express";
import isEmptyBody from "../midalwars/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import authControllers from "../controllers/authControllers.js";
import { authSignupSchema, authSigninSchema } from "../schemas/authSchemas.js"
import authtnticate  from "../midalwars/authenticate.js"
const authRouter = express.Router();
authRouter.post("/signup", isEmptyBody, validateBody(authSignupSchema), authControllers.signup);
authRouter.post("/signin", isEmptyBody, validateBody(authSigninSchema), authControllers.signin);
authRouter.get("/current", authtnticate, authControllers.getCurrent);
authRouter.post("/signout", authtnticate, authControllers.signout);
export default authRouter;
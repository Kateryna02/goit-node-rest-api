

import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../midalwars/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);
contactsRouter.get("/:id", contactsControllers.getOneContact);
contactsRouter.post("/", isEmptyBody, validateBody(createContactSchema), contactsControllers.createContact);
contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), contactsControllers.updateContact);
contactsRouter.delete("/:id", contactsControllers.deleteContact);

export default contactsRouter;



import express from 'express';
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../midalwars/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema , updateFavoriteSchema} from "../schemas/contactsSchemas.js";
import authtnticate from "../midalwars/authenticate.js"
import upload from "../midalwars/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authtnticate);

contactsRouter.get("/", contactsControllers.getAllContacts);
contactsRouter.get("/:id", contactsControllers.getOneContact);
contactsRouter.post("/", upload.single("poster"), isEmptyBody, validateBody(createContactSchema), contactsControllers.createContact);
contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), contactsControllers.updateContact);
contactsRouter.delete("/:id", contactsControllers.deleteContact);
contactsRouter.patch("/:contactId/favorite", validateBody(updateFavoriteSchema), contactsControllers.updateStatusContact);


export default contactsRouter;

import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import wrapper from "../decorator/wraper.js";
import getFilter from "../helpers/getFilter.js";
import fs from "fs/promises";
import path, { join } from "path";

const avatarsDir = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user; 
  const filter = {
    owner,
  };

  const {page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;
  const settings = {skip, limit};

  const result = await contactsService.listContacts({ filter, settings }); 
  
  res.json(result);
};


const getOneContact = async (req, res) => {
  const filter = getFilter(req);
  const result = await contactsService.getContactById(filter);
  if (!result) {
    throw HttpError(404, `contacts with id=${id} not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const filter = getFilter(req);
  const result = await contactsService.removeContact(filter);

  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
      const newPath = path.join(avatarsDir, filename);
  await fs.rename(oldPath, newPath);
  const poster = path.join( "avatars", filename)
  const result = await contactsService.addContact({...req.body, poster, owner});
  res.status(201).json(result);

};

const updateContact = async (req, res) => {
  const filter = getFilter(req);
  const result = await contactsService.updateContact(filter, req.body);

  if (!result) {
    throw HttpError(404, `contacts with id=${id} not found`);
  }

  res.status(200).json(result);
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const filter = getFilter(req); 
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      throw new HttpError(400, "Field 'favorite' must be a boolean");
    }

    const result = await contactsService.updateStatusContact(contactId, favorite, filter); 

    if (!result) {
      throw new HttpError(404, `Contact with id=${contactId} not found`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};


export default {
  getAllContacts: wrapper(getAllContacts),
  getOneContact: wrapper(getOneContact),
  deleteContact: wrapper(deleteContact),
  createContact: wrapper(createContact),
  updateContact: wrapper(updateContact),
  updateStatusContact: wrapper(updateStatusContact),
};

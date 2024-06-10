import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import wrapper from "../decorator/wraper.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `contacts with id=${id} not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);

  res.json(result);
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const result = await contactsService.updateContact(req.params.id, req.body);

  if (!result) {
    throw HttpError(404, `contacts with id=${id} not found`);
  }

  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    throw HttpError(400, "Missing field favorite");
  }

  const result = await contactsService.updateStatusContact(contactId, favorite);
  if (!result) {
    throw HttpError(404, `contacts with id=${contactId} not found`);
  }
  res.json(result);
};

export default {
  getAllContacts: wrapper(getAllContacts),
  getOneContact: wrapper(getOneContact),
  deleteContact: wrapper(deleteContact),
  createContact: wrapper(createContact),
  updateContact: wrapper(updateContact),
  updateStatusContact: wrapper(updateStatusContact),
};

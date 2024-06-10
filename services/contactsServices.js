

import Contact from "./models/contact.js";


export const listContacts = () => Contact.find();

export const getContactById = id => Contact.findById(id);

export const removeContact = contactId => Contact.findByIdAndDelete(contactId);

export const addContact = contactData => Contact.create(contactData);

export const updateContact = (id, newData) => Contact.findByIdAndUpdate(id, newData, { new: true });

export const updateStatusContact = (id, favorite) => {
    return Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};
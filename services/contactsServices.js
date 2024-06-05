
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
}

async function writeContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

export async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}

export const getContactById = async (id)=> {
    const contacts = await readContacts();
    const result = contacts.find(item => item.id === id);

    return result || null;
}

export async function removeContact(contactId) {
    const contacts = await readContacts();
    const index = contacts.findIndex(c => c.id === contactId);
    if (index === -1) return null;
    const [removedContact] = contacts.splice(index, 1);
    await writeContacts(contacts);
    return removedContact;
}

export async function addContact(contactData) {
    const { name, email, phone } = contactData;

    const contacts = await readContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    };
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
}
export async function updateContact(id, newData) {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        return null; 
    }
    contacts[index] = { ...contacts[index], ...newData };

    await writeContacts(contacts);

    return contacts[index]; 
}

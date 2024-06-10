import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string()
}).or('name', 'email', 'phone').messages({
    'object.missing': 'At least one field must be provided'
});


export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
      'any.required': 'Favorite field is required',
      'boolean.base': 'Favorite must be a boolean value'
    })
  });
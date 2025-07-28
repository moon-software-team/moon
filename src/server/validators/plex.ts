import joi from 'joi';

export const plexValidators = {
  'get-library-details': joi.object({
    sectionKey: joi.number().required()
  }),
  'get-library-content': joi.object({
    sectionKey: joi.number().required()
  })
};

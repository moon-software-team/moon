import joi from 'joi';

export const plexValidator = {
  'get-library-details': joi.object({
    sectionKey: joi.number().required()
  }),
  'get-library-content': joi.object({
    sectionKey: joi.number().required()
  }),
  'get-image': joi.object({
    uri: joi
      .string()
      .required()
      .pattern(/^\/library\/metadata\/\d+\/(thumb|art)\/\d+$/)
      .message('URI must be a valid Plex image path (e.g., /library/metadata/1809/thumb/1752970616)'),
    width: joi.number().integer().min(1).default(240),
    height: joi.number().integer().min(1).default(360)
  })
};

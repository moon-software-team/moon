/** Dependencies */
import joi from 'joi';

/**
 * @brief Player Validator
 * @description This validator is used to validate player-related requests.
 */
export const playerValidator = {
  'open': joi.object({
    input: joi.string().required(),
    options: joi
      .object({
        startTime: joi.number().optional(),
        audioTrack: joi.number().optional(),
        subtitleTrack: joi.number().optional(),
        videoTrack: joi.number().optional(),
        volume: joi.number().min(0).max(512).optional()
      })
      .optional()
  }),
  'seek': joi.object({
    value: joi
      .alternatives()
      .try(
        // Simple integer: 5
        joi.number().integer(),
        // Simple numbers: 5, +5, -5
        joi.string().pattern(/^[+-]?\d+$/),
        // Percentage: +5%, -5%
        joi.string().pattern(/^[+-]?\d+%$/),
        // Time format: HH:MM:SS
        joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
        // HMS format: 00H15M00S, 00h15m00s
        joi.string().pattern(/^[+-]?\d{2}[hH]\d{2}[mM]\d{2}[sS]$/),
        // Flexible HMS: 15m05s, 5h05'40", +00h50m, -40m, -40", -40'
        joi.string().pattern(/^[+-]?(?:\d+[hH])?(?:\d+[mM'"]?)?(?:\d+[sS"']?)?$/),
        // Quote format: 15'05", 5h05'40"
        joi.string().pattern(/^[+-]?\d+(?:[hH]\d+)?[']\d+["]$/)
      )
      .required()
  }),
  'audio-track': joi.object({
    track: joi.number().integer().min(0).required()
  }),
  'subtitle-track': joi.object({
    track: joi.number().integer().min(0).required()
  }),
  'video-track': joi.object({
    track: joi.number().integer().min(0).required()
  }),
  'volume': joi.object({
    value: joi
      .alternatives()
      .try(
        // Simple integer: 5
        joi.number().integer().min(-512).max(512),
        // Simple numbers: 5, +5, -5
        joi.string().pattern(/^[+-]?\d+$/),
        // Percentage: +5%, -5%
        joi.string().pattern(/^[+-]?\d+%$/)
      )
      .required()
  }),
  'fullscreen': joi.object({
    enabled: joi.boolean().required()
  }),
  'repeat': joi.object({
    enabled: joi.boolean().required()
  }),
  'random': joi.object({
    enabled: joi.boolean().required()
  }),
  'loop': joi.object({
    enabled: joi.boolean().required()
  }),
  'aspect-ratio': joi.object({
    value: joi
      .string()
      .valid('default', '1:1', '4:3', '5:4', '16:9', '16:10', '221:100', '235:100', '239:100')
      .required()
  })
};

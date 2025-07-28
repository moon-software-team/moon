// Dependencies
import { Schema } from 'joi';
import { RequestHandler } from 'express';

// Helper class to validate content of a query, params or body
class Validator {
  /**
   * Validate a schema through a middleware
   * @param where The emplacement of the data
   * @param schema The schema to validate
   * @returns A new middleware for the wanted schema
   */
  private validate(where: 'params' | 'query' | 'body', schema: Schema): RequestHandler {
    return (req, res, next): void => {
      // Get the schema validation
      const validation = schema.validate(req[where], { abortEarly: true });

      // On error, HTTP error 422
      if (validation.error) {
        res.status(422).json({ code: 422, error: validation.error.details[0].message });
        return;
      }

      // Set the value inside the request
      req.value = validation.value;

      // Next handler
      next();
    };
  }

  /**
   * Check the schema validation on the query
   * @param schema The schema to be checked
   * @returns A new middleware
   */
  public query(schema: Schema): RequestHandler {
    return this.validate('query', schema);
  }

  /**
   * Check the schema validation on the params
   * @param schema The schema to be checked
   * @returns A new middleware
   */
  public params(schema: Schema): RequestHandler {
    return this.validate('params', schema);
  }

  /**
   * Check the schema validation on the body
   * @param schema The schema to be checked
   * @returns A new middleware
   */
  public body(schema: Schema): RequestHandler {
    return this.validate('body', schema);
  }
}

// Export the validator
export const validator = new Validator();

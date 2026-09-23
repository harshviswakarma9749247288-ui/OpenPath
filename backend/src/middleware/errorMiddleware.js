import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[OpenPath Error Handler]:', err.message);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    return errorResponse(res, `Resource not found with id ${err.value}`, 404);
  }

  // Mongoose Duplicate Key (e.g. unique email or unique application pair)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    if (field === 'email') {
      return errorResponse(res, 'An account with this email address already exists.', 400);
    }
    if (err.keyPattern && err.keyPattern.user && err.keyPattern.opportunity) {
      return errorResponse(res, 'You have already applied to this opportunity.', 400);
    }
    return errorResponse(res, `Duplicate field value entered for ${field}.`, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 'Validation failed: ' + messages.join(', '), 400, messages);
  }

  // Default server error
  return errorResponse(
    res,
    err.message || 'An unexpected internal server error occurred.',
    err.statusCode || 500
  );
};

// middleware/errorHandler.js
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err.stack);
  
    // Default to 500 if no specific error status code is provided
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandlerMiddleware;
  
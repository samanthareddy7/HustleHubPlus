const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const isDevelopment = process.env.ENVIRONMENT_MODE === "development";

    return res.status(statusCode).json({
        error:
        statusCode === 500
        ? "An unexpected error occurred"
        : err.message,
        stack: isDevelopment ? err.stack : undefined
    });
};

module.exports = errorHandler;
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => {errors[error.path] = error.msg});
      // .forEach(error => errors[error.param] = error.msg);

      // console.log("errors", errors)

      // delete errors.stack;
      // delete errors.title;
      // console.log("errors2", errors)

    const err = Error("Bad request.");
    // console.log("err['title']", err.title)
    err.errors = errors;
    err.status = 400;
    // delete err.title;
    // delete err.stack;
    // console.log("err", err)
    // err.title = "Bad request.";
    next(err);
  }
  next();
};


module.exports = {
  handleValidationErrors
};
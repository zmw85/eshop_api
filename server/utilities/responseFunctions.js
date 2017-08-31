module.exports = {
  sendError: function(status, errors) {
    // 'errors' parameter can be a string, object or array, 
    // it will be converted to array if it's a single string or object
    if (!(errors instanceof Array)) {
      errors = [errors];
    }

    return this.status(status).send({
      errors: errors
    }).end();
  }
}
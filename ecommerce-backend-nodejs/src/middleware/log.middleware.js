const logMiddleware = (logger) => {
  return (req, res, next) => {
    logger.sendRequestInfo(req);
    next();
  };
};

module.exports = logMiddleware;

module.exports = function logger(req, res, next) {
  console.log(`[${new Date().toLocaleDateString()}] ::  ${req.url}`);
  next();
};

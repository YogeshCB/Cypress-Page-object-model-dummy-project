//Adding no cache for api calls
const noCache = (req, res, next) => {
  res.header('Cache-Control', 'no-store');
  next();
};

//Adding indicator for api calls
const isApi = (req, res, next) => {
  req._isApi = true;
  next();
};

export default [noCache, isApi];

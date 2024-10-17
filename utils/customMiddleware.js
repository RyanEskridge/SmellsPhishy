function ensureAuthenticated(req, res, next) {
  const publicPaths = ['/login', '/signup'];

  // Skip auth on public paths
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const { userId } = req.auth || {};

  // If user is authenticated proceed, otherwise redirect to login
  if (userId) {
    return next();
  } else {
    res.redirect(`/login`);
  }
}

module.exports = {
  ensureAuthenticated
};

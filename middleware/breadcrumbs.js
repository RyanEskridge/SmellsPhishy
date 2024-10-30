function breadcrumbs(req, res, next) {
    const pathArray = req.path.split('/').filter(segment => segment);
    const breadcrumbs = pathArray.map((segment, index) => {
      const href = '/' + pathArray.slice(0, index + 1).join('/');
      if (pathArray.length > 1) {
        return {
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            href: href
        };
      }
    });
  
    // Make breadcrumbs available in all views
    res.locals.breadcrumbs = breadcrumbs;
    next();
  }
  
  module.exports = breadcrumbs;
  
module.exports = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuth || false;
    if (res.locals.isAuthenticated) {
      next();
    } else {
      req.session.error = "You have to Login first";
      // destroy the session
        req.session.destroy(() => {
            res.redirect("/login");
        });
      
    }
  };
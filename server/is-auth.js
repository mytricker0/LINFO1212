module.exports = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      req.session.error = "You have to Login first";
      // destroy the session
        req.session.destroy(() => {
            res.redirect("/login");
        });
      
    }
  };
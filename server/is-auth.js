module.exports = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuth || false; 
    if (res.locals.isAuthenticated) { //si l'utilisateur est authentifié, on passe à la suite
      next();
    } else { //sinon on le redirige vers la page de login
      req.session.error = "You have to Login first";
        req.session.destroy(() => {
            res.redirect("/login");
        });
      
    }
  };
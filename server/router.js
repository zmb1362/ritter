const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRitzs', mid.requiresLogin, controllers.Ritz.getRitzs);
  app.get('/getAll', mid.requiresLogin, controllers.Ritz.getAllRitzs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Ritz.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Ritz.makeRitz);

  app.get('/settings', mid.requiresLogin, controllers.Ritz.settingsPage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);

  app.get('/getStatus', mid.requiresLogin, controllers.Account.getStatus);
  app.post('/changeStatus', mid.requiresLogin, controllers.Account.changeStatus);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('*', mid.redirect);
};

module.exports = router;

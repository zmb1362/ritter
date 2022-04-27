const models = require('../models');
const AccountModel = require('../models/Account');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, accountStatus: 0 });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const changePass = async (req, res) => {
  const username = `${req.session.account.username}`;
  const pass = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New password does not match!' });
  }

  const hash = await Account.generateHash(newPass);

  return Account.changePass(username, pass, hash, (err, noMatch) => {
    if (err || noMatch) {
      return res.status(401).json({ error: 'Wrong password!' });
    }
    return res.status(200).json({ error: 'Changed your password!' });
  });
};

const changeStatus = async (req, res) => {
  const username = `${req.session.account.username}`;

  try {
    await Account.changeStatus(username);
    return res.json({ redirect: '/settings' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
};

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const getStatus = (req, res) => AccountModel.findStatus(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ account: docs });
});

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
  changeStatus,
  getToken,
  getStatus,
};

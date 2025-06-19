const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;

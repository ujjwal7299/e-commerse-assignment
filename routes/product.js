const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('products', { products, user: req.session.user });
});

router.post('/add', async (req, res) => {
  const { title, description, price, image } = req.body;
  if (req.session.user?.role !== 'superadmin') return res.sendStatus(403);
  await Product.create({ title, description, price, image });
  res.redirect('/products');
});

router.post('/delete/:id', async (req, res) => {
  if (req.session.user?.role !== 'superadmin') return res.sendStatus(403);
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/products');
});

module.exports = router;

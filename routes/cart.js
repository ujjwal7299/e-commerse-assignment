const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "singhdairy72@gmail.com",
    pass: "kqmh tart gekj hymg"
  }
});

router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const cart = await Cart.findOne({ userId: req.session.user._id }) || { items: [] };
  const items = await Promise.all(cart.items.map(async item => {
    const product = await Product.findById(item.productId);
    return { product, qty: item.qty, price: product ? product.price : 0 };
  }));
  const total = items.length > 0 ? items.reduce((sum, item) => sum + (item.price * item.qty), 0) : 0;
  res.render('cart', { items, total });
});

router.post('/add', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { productId } = req.body;
  let cart = await Cart.findOne({ userId: req.session.user._id });
  if (!cart) cart = await Cart.create({ userId: req.session.user._id, items: [] });
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx > -1) cart.items[idx].qty += 1;
  else cart.items.push({ productId, qty: 1 });
  await cart.save();
  res.redirect('/products');
});

router.post('/checkout', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { address } = req.body;
  if (!address) return res.send('Shipping address is required.');
  const cart = await Cart.findOne({ userId: req.session.user._id });
  const userEmail = req.session.user.email;
  await transporter.sendMail({
    from: "singhdairy72@gmail.com",
    to: userEmail,
    subject: 'Order Confirmation',
    text: `Thanks for your purchase. Your order is confirmed! Shipping to: ${address}`
  });
  cart.items = [];
  await cart.save();
  res.render('cart', { items: [], total: 0, success: 'Checkout complete! Your order has been placed.' });
});

router.post('/decrement/:productId', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { productId } = req.params;
  let cart = await Cart.findOne({ userId: req.session.user._id });
  if (!cart) return res.redirect('/cart');
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx > -1) {
    cart.items[idx].qty -= 1;
    if (cart.items[idx].qty <= 0) {
      cart.items.splice(idx, 1);
    }
    await cart.save();
  }
  res.redirect('/cart');
});

module.exports = router;

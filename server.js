// //require('dotenv').config();
const express = require('express');
const mongoose = require('./db');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//console.log("1");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));

const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login
app.post('/login', async (req, res) => {
  const User = require('./models/User');
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.send(' Invalid email or password');
  req.session.user = user.toObject();
  res.redirect('/dashboard');
});

// Register Page
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle Registration
app.post('/register', async (req, res) => {
  const User = require('./models/User');
  const { email, password } = req.body;
 
  const existing = await User.findOne({ email });
  if (existing) return res.send('User already exists. <a href="/login">Login</a>');
  const user = await User.create({ email, password });
  req.session.user = user.toObject();
  res.redirect('/');
});

// Home Page
app.get('/', (req, res) => {
  res.render('home', { user: req.session.user });
});

// Dashboard Page
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// Start Server and Auto-Open in Browser
// app.listen(4000, () => {
//   console.log(' Server running at http://localhost:4000');
//   import('open').then(open => open.default('http://localhost:4000'));
// });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

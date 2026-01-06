const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Enquiry = require('./models/Enquiry');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// ===============================
// ========== USER APIS ==========
// ===============================

// 1️⃣ SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { phone } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.json({ success: false });
    }

    const user = await User.create({
      phone,
      cart: []
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 2️⃣ LOGIN
app.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (user) {
      return res.json({ success: true, user });
    }

    res.json({ success: false });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 9️⃣ USER DATA
app.get('/userdata', async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json(null);
  }
});

// ===============================
// ======== PRODUCT APIS =========
// ===============================

// 3️⃣ GET ALL PRODUCTS
app.get('/getproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json([]);
  }
});

// 5️⃣ GET SPECIFIC PRODUCT
app.get('/getspecificproduct', async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json(null);
  }
});

// 6️⃣ GET SIMILAR PRODUCTS
app.get('/getsimilarproduct', async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Product.findById(id);
    if (!product) return res.json([]);

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: id }
    }).limit(10);

    res.json(similarProducts);
  } catch (err) {
    res.status(500).json([]);
  }
});

// ===============================
// ========= CART APIS ===========
// ===============================

// 7️⃣ POST CART
app.post('/postcart', async (req, res) => {
  try {
    const { userId, product } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false });

    user.cart.push(product);
    await user.save();

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 8️⃣ GET CART
app.get('/getcart', async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId);
    res.json(user.cart);
  } catch (err) {
    res.status(500).json([]);
  }
});

// ===============================
// ======== ENQUIRY API ==========
// ===============================

// 4️⃣ SUBMIT ENQUIRY
app.post('/submitenquiry', async (req, res) => {
  try {
    await Enquiry.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

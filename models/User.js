const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    cart: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

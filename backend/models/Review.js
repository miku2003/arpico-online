const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  product_id: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

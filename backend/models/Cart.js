const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

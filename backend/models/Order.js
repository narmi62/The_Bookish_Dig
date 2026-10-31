const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    customer: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

  books: [
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Placed",
    },
  },
  { timestamps: true },
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

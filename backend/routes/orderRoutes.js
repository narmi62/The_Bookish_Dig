const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Book = require("../models/Book");
const {
  verifyFirebaseToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

// Place an order
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { customer } = req.body;
    const userId = req.user.uid;

    // Validate customer details
    if (
      !customer?.fullName?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide all customer details",
      });
    }

    // Always use the logged-in customer's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.books.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const orderBooks = [];
    let totalAmount = 0;

    // Get current prices from MongoDB
    for (const item of cart.books) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return res.status(400).json({
          message: "A book in your cart is no longer available",
        });
      }

      const quantity = item.quantity;

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Invalid book quantity in cart",
        });
      }

      orderBooks.push({
        bookId: book._id,
        title: book.title,
        author: book.author,
        priceAtPurchase: book.price,
        image: book.image,
        quantity,
      });

      totalAmount += book.price * quantity;
    }

    // Save the order
    const order = await Order.create({
      userId,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
      },
      books: orderBooks,
      totalAmount,
    });

    // Clear only this customer's cart after successful order creation
    cart.books = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return res.status(500).json({
      message: "Failed to place order",
    });
  }
});

// Customers can fetch only their own orders
router.get("/myorders", verifyFirebaseToken, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.uid,
    })
      .populate("books.bookId", "title author price image")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch customer orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch your orders",
    });
  }
});

// Admin can fetch all orders
router.get("/", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch admin orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;

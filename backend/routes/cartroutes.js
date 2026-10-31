const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const { verifyFirebaseToken } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const Book = require("../models/Book");

// Apply authentication to all cart routes
router.use(verifyFirebaseToken);

// Add book to cart
router.post("/", async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.uid;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, books: [] });
    }

    const existingBook = cart.books.find(
      (item) => item.bookId.toString() === bookId
    );

    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      cart.books.push({ bookId, quantity: 1 });
    }

    await cart.save();
    await cart.populate("books.bookId");

    res.status(200).json({
      message: "Book added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the logged-in customer's cart
router.get("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const cart = await Cart.findOne({ userId }).populate("books.bookId");

    res.status(200).json({
      books: cart?.books || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update book quantity
router.patch("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const quantity = Number(req.body.quantity);
    const userId = req.user.uid;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.books.find(
      (item) => item.bookId.toString() === bookId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Book not found in cart",
      });
    }

    cartItem.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("books.bookId");

    res.status(200).json({
      books: updatedCart.books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a book from the logged-in customer's cart
router.delete("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.books = cart.books.filter(
      (item) => item.bookId.toString() !== bookId
    );

    await cart.save();
    await cart.populate("books.bookId");

    res.status(200).json({
      message: "Book removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
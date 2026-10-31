const Book = require("../models/Book")
const express = require ('express');
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

const streamifier = require("streamifier");

router.get("/",async(req,res)=>
{
    try
    {
        const books = await Book.find();
        res.status(200).json(books)
    }
    catch(error)
    {
        res.status(500).json({message:error.message})
    }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 1. Check whether an image was selected
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a book image",
      });
    }

    // 2. Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "book-store" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // 3. Save book details and Cloudinary image URL in MongoDB
    const newBook = await Book.create({
      ...req.body,
      image: result.secure_url,
    });

    // 4. Send saved book details to frontend
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Book upload error:", error);

    res.status(500).json({
      message: error.message || "Failed to add book",
    });
  }
});

module.exports = router;
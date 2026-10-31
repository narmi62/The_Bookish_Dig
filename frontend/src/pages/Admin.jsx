import { Link } from "react-router-dom";
import { useState } from "react";
function Admin() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  function handleChange(event) {
    const { name, value, type, files } = event.target;
    setBook({
      ...book,
      [name]: type === "file" ? files[0] : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Add book button Clicked");
    try {
      const formData = new FormData();

      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("price", book.price);
      formData.append("category", book.category);
      formData.append("description", book.description);
      formData.append("image", book.image);
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();

      console.log("Status:", response.status);
      console.log("Backend response:", responseText);

      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      alert("Book added successfully!");
      console.log("Saved book:", data);
      setBook({
        title: "",
        author: "",
        price: "",
        category: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.log(error.message);
    }
  }


return (
  <div className="max-w-xl mx-auto p-6">

    {/* Admin Dashboard Heading */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">
        Add New Book
      </h2>

      <Link
        to="/admin/orders"
        className="rounded-lg bg-amber-950 px-4 py-2 text-white"
      >
        View Orders
      </Link>
    </div>

    {/* Add Book Form */}
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={book.title}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="author"
        placeholder="Author"
        value={book.author}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={book.price}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={book.category}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={book.description}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full border p-3 rounded"
      />

      <button
        type="submit"
        className="w-full bg-amber-800 text-white p-3 rounded"
      >
        Add Book
      </button>

    </form>
  </div>
);

}

export default Admin;

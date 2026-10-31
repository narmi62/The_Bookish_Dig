import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

 const addToCart = async (bookId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    const token = await user.getIdToken();

    const response = await fetch("https://the-bookish-dig.onrender.com/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add book to cart");
    }

    alert("Book added to cart successfully!");
  } catch (error) {
    console.error("Error adding book to cart:", error);
    alert(error.message || "Failed to add book to cart");
  }
};

  useEffect(() => {
    fetch("https://the-bookish-dig.onrender.com/api/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.log("Error fetching books:", error);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(books.map((book) => book.category).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="bg-amber-100 px-6 py-14 text-center md:py-20">
        <p className="mb-3 font-semibold uppercase tracking-widest text-amber-800">
          Welcome to The Bookish Dig
        </p>

        <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-amber-950 md:text-5xl">
          Discover Your Next Favourite Book
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-700">
          Explore inspiring stories, discover new ideas, and find your next
          great read.
        </p>

        <a
          href="#books"
          className="mt-7 inline-block rounded-lg bg-amber-900 px-6 py-3 font-semibold text-white hover:bg-amber-800"
        >
          Explore Books
        </a>
      </section>

      {/* Books Section */}
      <section id="books" className="px-6 py-12 md:px-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-amber-950">
            Explore Our Books
          </h2>
          <p className="mt-2 text-gray-600">
            Find a book that matches your interests.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-5 max-w-xl">
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-700"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 font-medium transition ${
                selectedCategory === category
                  ? "bg-amber-900 text-white"
                  : "bg-white text-amber-950 hover:bg-amber-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Book Cards */}
        {filteredBooks.length === 0 ? (
          <p className="py-10 text-center text-gray-600">
            No books found. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="flex h-full flex-col rounded-xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="min-h-[56px] text-xl font-bold leading-7 text-amber-950">
                  {book.title}
                </h3>

                <p className="mt-1 text-gray-500">{book.author}</p>

                <p className="mt-2 text-lg font-bold text-amber-900">
                  ₹{book.price}
                </p>

                <div className="my-4 flex h-48 items-center justify-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mb-4 inline-block self-start rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-950">
                  {book.category}
                </p>

                <button
                  type="button"
                  onClick={() => addToCart(book._id)}
                  className="mt-auto w-full rounded-lg bg-amber-900 px-4 py-3 font-semibold text-white"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 px-6 py-6 text-center text-white">
        <p>© 2026 The Bookish Dig. Happy Reading! 📚</p>
      </footer>
    </div>
  );
}

export default Home;

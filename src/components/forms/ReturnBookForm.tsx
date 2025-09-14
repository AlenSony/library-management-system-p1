import { useState } from "react";
import { useBooks } from "../../hooks/useBooks";
import { useReaders } from "../../hooks/useReaders";
import AlertMessage from "../AlertMessage";

const ReturnBookForm = () => {
  const [formData, setFormData] = useState({
    reader_name: "",
    book_name: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { readers, isLoading: readersLoading } = useReaders();
  const { books, isLoading: booksLoading } = useBooks();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/bookissue", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Book returned successfully!" });
        setFormData({ reader_name: "", book_name: "" });
      } else {
        const errorData = await response.json();
        setAlert({
          type: "error",
          message: errorData.message || "Failed to return book",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="library-card fade-in max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Return Book
      </h2>

      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: "" })}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reader_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Reader
          </label>
          <select
            id="reader_name"
            name="reader_name"
            value={formData.reader_name}
            onChange={handleChange}
            className="library-input"
            required
            disabled={readersLoading}
          >
            <option value="">Select a reader</option>
            {readers.map((reader) => (
              <option key={reader._id} value={reader.name}>
                {reader.name} ({reader.readerID}) - {reader.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="book_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Book
          </label>
          <select
            id="book_name"
            name="book_name"
            value={formData.book_name}
            onChange={handleChange}
            className="library-input"
            required
            disabled={booksLoading}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book._id} value={book.title}>
                {book.title} by {book.author?.name || "Unknown"}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="library-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Returning Book..." : "Return Book"}
        </button>
      </form>
    </div>
  );
};

export default ReturnBookForm;

import { useState } from 'react';
import AlertMessage from '../AlertMessage';

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    bookID: '',
    title: '',
    author: '',
    publisher: '',
    edition: '',
    price: '',
    availability: true,
    stock: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Book added successfully!' });
        setFormData({
          bookID: '',
          title: '',
          author: '',
          publisher: '',
          edition: '',
          price: '',
          availability: true,
          stock: '',
        });
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.message || 'Failed to add book' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="library-card fade-in max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New Book</h2>
      
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: '' })}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bookID" className="block text-sm font-medium text-gray-700 mb-2">
            Book ID
          </label>
          <input
            type="text"
            id="bookID"
            name="bookID"
            value={formData.bookID}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author (ObjectId)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
            Publisher (ObjectId)
          </label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-2">
            Edition
          </label>
          <input
            type="text"
            id="edition"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="availability"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
            Available
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="library-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
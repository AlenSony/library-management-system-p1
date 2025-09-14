import { useState } from 'react';
import AlertMessage from '../AlertMessage';

const IssueBookForm = () => {
  const [formData, setFormData] = useState({
    reader_name: '',
    book_name: '',
    status: '',
    issueDate: '',
    returnDate: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Book issued successfully!' });
        setFormData({
          reader_name: '',
          book_name: '',
          status: '',
          issueDate: '',
          returnDate: '',
        });
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.message || 'Failed to issue book' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="library-card fade-in max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Issue Book</h2>
      
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: '' })}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reader_name" className="block text-sm font-medium text-gray-700 mb-2">
            Reader Name
          </label>
          <input
            type="text"
            id="reader_name"
            name="reader_name"
            value={formData.reader_name}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="book_name" className="block text-sm font-medium text-gray-700 mb-2">
            Book Name
          </label>
          <input
            type="text"
            id="book_name"
            name="book_name"
            value={formData.book_name}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="library-input"
            required
          >
            <option value="">Select status</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
            Return Date
          </label>
          <input
            type="date"
            id="returnDate"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="library-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Issuing Book...' : 'Issue Book'}
        </button>
      </form>
    </div>
  );
};

export default IssueBookForm;
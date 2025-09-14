import { useState } from 'react';
import AlertMessage from '../AlertMessage';

const AddPublisherForm = () => {
  const [formData, setFormData] = useState({
    publisherID: '',
    name: '',
    yearOfPublication: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/publishers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          yearOfPublication: parseInt(formData.yearOfPublication),
        }),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Publisher added successfully!' });
        setFormData({ publisherID: '', name: '', yearOfPublication: '' });
      } else {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.message || 'Failed to add publisher' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="library-card fade-in max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New Publisher</h2>
      
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: '' })}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="publisherID" className="block text-sm font-medium text-gray-700 mb-2">
            Publisher ID
          </label>
          <input
            type="text"
            id="publisherID"
            name="publisherID"
            value={formData.publisherID}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="library-input"
            required
          />
        </div>

        <div>
          <label htmlFor="yearOfPublication" className="block text-sm font-medium text-gray-700 mb-2">
            Year of Publication
          </label>
          <input
            type="number"
            id="yearOfPublication"
            name="yearOfPublication"
            value={formData.yearOfPublication}
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
          {isLoading ? 'Adding Publisher...' : 'Add Publisher'}
        </button>
      </form>
    </div>
  );
};

export default AddPublisherForm;
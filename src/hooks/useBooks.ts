import { useEffect, useState } from 'react';

interface Book {
  _id: string;
  bookID: string;
  title: string;
  author: {
    _id: string;
    name: string;
  };
  publisher: {
    _id: string;
    name: string;
  };
  edition: string;
  price: number;
  availability: boolean;
  stock: number;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books || []);
        } else {
          setError('Failed to fetch books');
        }
      } catch (err) {
        setError('Network error while fetching books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, isLoading, error };
};

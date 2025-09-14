import { useEffect, useState } from 'react';

interface Author {
  _id: string;
  authorID: string;
  name: string;
  email: string;
}

export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/authors');
        if (response.ok) {
          const data = await response.json();
          setAuthors(data.authors || []);
        } else {
          setError('Failed to fetch authors');
        }
      } catch (err) {
        setError('Network error while fetching authors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return { authors, isLoading, error };
};

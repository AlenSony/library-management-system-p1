import { useEffect, useState } from 'react';

interface Reader {
  _id: string;
  readerID: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const useReaders = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/readers');
        if (response.ok) {
          const data = await response.json();
          setReaders(data.readers || []);
        } else {
          setError('Failed to fetch readers');
        }
      } catch (err) {
        setError('Network error while fetching readers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReaders();
  }, []);

  return { readers, isLoading, error };
};

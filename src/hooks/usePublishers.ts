import { useEffect, useState } from 'react';

interface Publisher {
  _id: string;
  publisherID: string;
  name: string;
  yearOfPublication: number;
}

export const usePublishers = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/publishers');
        if (response.ok) {
          const data = await response.json();
          setPublishers(data.publishers || []);
        } else {
          setError('Failed to fetch publishers');
        }
      } catch (err) {
        setError('Network error while fetching publishers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishers();
  }, []);

  return { publishers, isLoading, error };
};

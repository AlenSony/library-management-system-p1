import { useEffect, useState } from "react";
import AlertMessage from "../AlertMessage";

interface BookIssue {
  _id: string;
  reader_name: string;
  book_name: string;
  status: string;
  issueDate: string;
  returnDate?: string;
  readerID: {
    _id: string;
    name: string;
  };
  bookID: {
    _id: string;
    title: string;
  };
}

const BookIssuesView = () => {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookIssues = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookissues");
      if (response.ok) {
        const data = await response.json();
        setBookIssues(data.bookIssues || []);
      } else {
        setAlert({ type: "error", message: "Failed to fetch book issues" });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookIssues();
  }, []);

  if (isLoading) {
    return (
      <div className="library-card fade-in max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Book Issues
        </h2>
        <div className="text-center">Loading book issues...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="library-card fade-in max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Book Issues
      </h2>

      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: "" })}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reader Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookIssues.map((issue) => (
              <tr key={issue._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {issue.reader_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {issue.book_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}
                  >
                    {issue.status.charAt(0).toUpperCase() +
                      issue.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(issue.issueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {issue.returnDate
                    ? new Date(issue.returnDate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookIssues.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No book issues found.
        </div>
      )}
    </div>
  );
};

export default BookIssuesView;

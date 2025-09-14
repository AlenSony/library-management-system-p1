import { useState } from "react";
import AlertMessage from "../AlertMessage";

const AddStaffForm = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
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
      const response = await fetch("http://localhost:3000/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Staff member added successfully!",
        });
        setFormData({ name: "" });
      } else {
        const errorData = await response.json();
        setAlert({
          type: "error",
          message: errorData.message || "Failed to add staff member",
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
        Add New Staff
      </h2>

      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: "" })}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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

        <button
          type="submit"
          disabled={isLoading}
          className="library-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding Staff..." : "Add Staff"}
        </button>
      </form>
    </div>
  );
};

export default AddStaffForm;

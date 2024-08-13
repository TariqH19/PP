import React, { useState } from "react";
import axios from "axios";

const AddItemForm = () => {
  const [type, setType] = useState("cart");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        type === "cart"
          ? "https://gym-api-omega.vercel.app/api/cart"
          : "https://gym-api-omega.vercel.app/api/custom";

      await axios.post(url, { name, notes });
      alert("Item added successfully");
      setName("");
      setNotes("");
    } catch (err) {
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">{`Add New ${
        type === "cart" ? "Cart" : "Custom Item"
      }`}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700">
            Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="cart">Cart</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700">
            Notes:
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}>
            {loading ? "Adding..." : "Add Item"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;

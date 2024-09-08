"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/product', {
        title: productName,
        description,
        price,
      });
      console.log(response.data);
      setError(null);
    } catch (error) {
      console.error('Error posting product:', error.response ? error.response.data : error.message);
      setError('Failed to submit the product. Please try again.');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">New Product</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <label className="mb-2 font-semibold">Product Name</label>
      <input
        type="text"
        className="mb-4 p-2 border rounded"
        placeholder="Enter product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <label className="mb-2 font-semibold">Description</label>
      <textarea
        className="mb-4 p-2 border rounded"
        placeholder="Enter product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label className="mb-2 font-semibold">Price (in USD)</label>
      <input
        type="number"
        className="mb-4 p-2 border rounded"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </>
  );
};

export default Form;
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState(null);
  const [properties, setProperties] = useState(''); // State for properties
  const [brand, setBrand] = useState(''); // State for brand
  const [color, setColor] = useState(''); // State for color
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false); // State for edit mode
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name) {
      setError('Category name is required');
      return;
    }
    if (!brand) {
      setError('Brand is required');
      return;
    }
    if (!color) {
      setError('Color is required');
      return;
    }

    console.log('Form submitted with:', { name, parent, properties, brand, color });

    try {
      const response = await axios.post('/api/category', { name, parent, properties, brand, color });
      console.log('Response from server:', response.data);
      fetchCategories();
      setName('');
      setParent(null);
      setProperties(''); // Reset properties field
      setBrand(''); // Reset brand field
      setColor(''); // Reset color field
      setEdit(false); // Reset edit mode
      setError(null); // Clear error message
    } catch (error) {
      setError('Error submitting form');
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setParent(category.parent ? category.parent._id : null);
    setProperties(category.properties || '');
    setBrand(category.brand || '');
    setColor(category.color || '');
    handleDelete(category);
    setCategories(categories.filter((cat) => cat._id !== category._id));
    setEdit(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete('/api/category', { data: { categoryId } });
      setCategories(categories.filter((category) => category._id !== categoryId));
      fetchCategories();
    } catch (error) {
      setError('Error deleting category');
      console.error('Error deleting category:', error.response ? error.response.data : error.message);
    }
  };
  const handleViewProperties = (category) => {
    setSelectedCategory(selectedCategory === category._id ? null : category._id);
  };

  return (
    <div className="mt-4 w-full h-full overflow-scroll overflow-x-hidden">
      <h2 className="text-xl font-bold mb-2 text-blue-900">Categories</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-2">
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Category Name"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Parent Category</label>
          <select
            name="parent"
            value={parent || ''}
            onChange={(e) => setParent(e.target.value || null)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">No parent</option>
            {categories.filter(category => !category.parent).map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Properties</label>
          <input
            type="text"
            name="properties"
            value={properties}
            onChange={(e) => setProperties(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Properties"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Brand"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Color</label>
          <input
            type="text"
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Color"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {edit ? "Edit Category" : "Add Category"}
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 text-blue-900">Parent Categories</h3>
        <ul className='w-full justify-center items-center border-slate-900'>
          {categories.filter(category => !category.parent).map((category) => (
            <li key={category._id} className="w-[70%] mb-2 flex justify-between">
              <div className='flex flex-col'>{category.name}
              {selectedCategory === category._id && (
                <div className="mt-2 container bg-green-800 ">
                  <p><strong>Properties:</strong> {category.properties}</p>
                  <p><strong>Brand:</strong> {category.brand}</p>
                  <p><strong>Color:</strong> {category.color}</p>
                </div>
              )}
              </div>
              <div >
                <button onClick={() => handleEdit(category)} className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(category._id)} className="ml-2 px-2 py-1 bg-red-800 text-white rounded">
                  Delete
                </button>
                <button onClick={() => handleViewProperties(category)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                  View Properties
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 text-blue-900">Category List</h3>
        <ul className='w-full justify-center items-center'>
          {categories.filter(category => category.parent).map((category) => (
            <li key={category._id} className="w-[70%] mb-2 flex justify-between">
              <div className='flex flex-col'>
                {category.name} (Parent: {category.parent.name})
                {selectedCategory === category._id && (
                  <div className="mt-2">
                    <p><strong>Properties:</strong> {category.properties}</p>
                    <p><strong>Brand:</strong> {category.brand}</p>
                    <p><strong>Color:</strong> {category.color}</p>
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => handleEdit(category)} className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(category._id)} className="ml-2 px-2 py-1 bg-red-800 text-white rounded">
                  Delete
                </button>
                <button onClick={() => handleViewProperties(category)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                  View Properties
                </button>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;

"use client";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
const Form = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    const title = searchParams.get('title');
    const desc = searchParams.get('description');
    const prc = searchParams.get('price');
    const cat = searchParams.get('category');
    const imgs = searchParams.get('mediaUrl') ? [searchParams.get('mediaUrl')] : [];
    console.log('Search Params:', searchParams);
    if (id && title && desc && prc && cat && imgs.length) {
      setEditProductId(id);
      setProductName(title);
      setDescription(desc);
      setPrice(prc);
      setSelectedCategory(cat);
      setImageUrls(imgs);
    }
  }, [searchParams]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
        console.log('Categories:', response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrls = [...imageUrls];
      if (images.length) {
        const uploadPromises = images.map(async (image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(storageRef, image);
          return await getDownloadURL(storageRef);
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const productData = {
        name: productName,
        description,
        price,
        category: selectedCategory,
        images: uploadedImageUrls,
      };

      let response;
      if (editProductId) {
        // Update existing product
        response = await axios.put('/api/product', { productId: editProductId, ...productData });
      } else {
        // Add new product
        response = await axios.post('/api/product', productData);
      }

      console.log('Response from server:', response.data);
      router.push('/AddProduct');
    } catch (error) {
      setError('Error submitting form');
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">{editProductId ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-2">
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Product Name"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Description"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter Price"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2 flex flex-col">
          <label htmlFor="images" className="block text-gray-700">Images</label>
          <label className="text-gray-700 h-[100px] w-[100px] bg-slate-500 flex items-center gap-1 hover:rounded-lg border cursor-pointer">
            <input
              type="file"
              id="images"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            {images.length ? (
              images.map((image, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(image)}
                  height={100}
                  width={100}
                  className="object-cover rounded-lg"
                  alt="Selected"
                />
              ))
            ) : (
              imageUrls.length ? (
                imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    height={100}
                    width={100}
                    className="object-cover rounded-lg"
                    alt="Selected"
                  />
                ))
              ) : (
                <span className="text-gray-700 text-center">Select Images</span>
              )
            )}
          </label>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {editProductId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default Form;
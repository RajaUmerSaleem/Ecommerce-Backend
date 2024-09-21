"use client";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const Form = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    const title = searchParams.get('title');
    const desc = searchParams.get('description');
    const prc = searchParams.get('price');
    const img = searchParams.get('mediaUrl');

    if (id && title && desc && prc && img) {
      setEditProductId(id);
      setProductName(title);
      setDescription(desc);
      setPrice(prc);
      setImageUrl(img);
    }
  }, [searchParams]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrl = imageUrl;
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        uploadedImageUrl = await getDownloadURL(storageRef);
        console.log('File available at', uploadedImageUrl);
      }

      const productData = {
        title: productName,
        description,
        price,
        mediaUrl: uploadedImageUrl,
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
        <div className="mb-2 flex flex-col">
          <label htmlFor="image" className="block text-gray-700">Image</label>
          <label className="text-gray-700 h-[100px] w-[100px] bg-slate-500 flex items-center gap-1 hover:rounded-lg border cursor-pointer">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImageChange}
            />
            {image ? (
              <img src={URL.createObjectURL(image)} className="h-[100px] w-[100px] object-cover rounded-lg" alt="Selected" />
            ) : (
              imageUrl && (
                <img src={imageUrl} className="h-[100px] w-[100px] object-cover rounded-lg" alt="Selected" />
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
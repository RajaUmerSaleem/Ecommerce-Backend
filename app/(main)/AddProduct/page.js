"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        setProducts(response.data);
        console.log('Products:', response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = async (product) => {
    try {
      let n = prompt("Are you sure you want to edit this product? Type 'yes' to confirm.");
      if (n == "yes") {
        alert("Product Edit Initiated");
        const query = new URLSearchParams({
          id: product._id,
          title: product.name,
          description: product.description,
          price: product.price,
          category: product.category._id,
          mediaUrl: product.images.length > 0 ? product.images[0] : undefined,
        }).toString();
        router.push(`/Product?${query}`);
      } else {
        alert("Product Edit Cancelled");
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      let n = prompt("Are you sure you want to delete this product? Type 'yes' to confirm.");
      if (n == "yes") {
        alert("Product Deleted Successfully");
        await axios.delete('/api/product', { data: { productId } });
        const response = await axios.get('/api/product');
        setProducts(response.data);
      } else {
        alert("Product Not Deleted");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="w-[20%] h-[50px] bg-black hover:bg-gray-900 flex items-center justify-center hover:rounded-none rounded-lg">
        <Link href="/Product" className="text-white w-full flex items-center justify-center">
          <div className="text-white font-bold">Add New Products</div>
        </Link>
      </div>
      <div className="mt-4 h-[80vh]">
        <h2 className="text-xl font-bold mb-2">Products List</h2>
        <div className="min-w-full bg-white">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-[2px] border-black">Title</th>
                <th className="py-2 px-4 border-[2px] border-black">Description</th>
                <th className="py-2 px-4 border-[2px] border-black">Price</th>
                <th className="py-2 px-4 border-[2px] border-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border shadelow">{product.name}</td>
                  <td className="py-2 px-4 border shadelow">{product.description}</td>
                  <td className="py-2 px-4 border shadelow">${product.price}</td>
                  <td className="border flex justify-around items-center">
                    <button onClick={() => handleDelete(product._id)} className="h-full shadelow text-blue-900 font-extrabold flex justify-center items-center"><img className="w-[35px]" src="delete-2-svgrepo-com.svg" alt="yango" /></button>
                    <button onClick={() => handleEdit(product)} className="h-full shadelow text-blue-900 font-extrabold flex justify-center items-center"><img className="w-[35px]" src="edit-svgrepo-com (1).svg" alt="yango" /></button>
                    <button onClick={() => handleViewDetails(product)} className="h-full shadelow text-blue-900 font-extrabold flex justify-center items-center"><img className="w-[35px]" src="view-svgrepo-com.svg" alt="view" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedProduct && (
        <div className="mt-4 p-4 w-[50vw] bg-gray-100 border border-gray-300 absolute">
          <h3 className="text-lg font-bold mb-2">Product Details</h3>
          <p><strong>Title:</strong> {selectedProduct.name}</p>
          <p><strong>Description:</strong> {selectedProduct.description}</p>
          <p><strong>Price:</strong> ${selectedProduct.price}</p>
          <p><strong>Category:</strong> {selectedProduct.category.name}</p>
          <div>
            <strong>Images:</strong>
            <div className="flex">
              {selectedProduct.images.map((image, index) => (
                <img key={index} src={image} alt={`Product Image ${index + 1}`} className="w-24 h-24 mr-2" />
              ))}
            </div>
          </div>
          <button onClick={() => setSelectedProduct(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Close</button>
        </div>
      )}
    </>
  );
};

export default Page;
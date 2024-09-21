"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const Page = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    const query = new URLSearchParams({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      mediaUrl: product.mediaUrl,
    }).toString();
    router.push(`/Product?${query}`);
  };

  const handleDelete = async (productId) => {
    try {
      let n = prompt("Are you sure you want to delete this product? Type 'yes' to confirm.");
      if (n == "yes") { alert("Product Deleted Successfully");
        await axios.delete('/api/product', { data: { productId } });
        const response = await axios.get('/api/product');
        setProducts(response.data);
       }
      else{
        alert("Product Not Deleted");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
          </table>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full">
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border shadelow">{product.title}</td>
                    <td className="py-2 px-4 border shadelow">{product.description}</td>
                    <td className="py-2 px-4 border shadelow">${product.price}</td>
                    <td className="border flex justify-around items-center">
                      <button onClick={() => handleDelete(product._id)} className="h-full shadelow text-blue-900 font-extrabold flex justify-center items-center"><img className="w-[35px]" src="delete-2-svgrepo-com.svg" alt="yango" /></button>
                      <button onClick={() => handleEdit(product)} className="h-full shadelow text-blue-900 font-extrabold flex justify-center items-center" ><img className="w-[35px]" src="edit-svgrepo-com (1).svg" alt="yango" /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
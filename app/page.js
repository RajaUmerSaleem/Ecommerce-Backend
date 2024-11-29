"use client"
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from 'axios';
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import CategoryChartComponent from "./Components/CategoryChartComponent";
import ProductChartComponent from "./Components/ProductChartComponent";
import RevenueChartComponent from "./Components/RevenueChartComponent";
export default function Home() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viewMode, setViewMode] = useState('revenue');
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        console.log(response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data.map(category => ({
            name: category.name,
            brand: category.brand,
            color: category.color,
            properties: category.properties,
          }));
          setCategoryData(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data.map(product => ({
            name: product.name,
            price: product.price,
            category: product.category.name,
          }));
          setProductData(data);

          // Process data for category chart
          const categoryCount = {};
          data.forEach(product => {
            if (categoryCount[product.category]) {
              categoryCount[product.category]++;
            } else {
              categoryCount[product.category] = 1;
            }
          });

          const categoryChartData = Object.keys(categoryCount).map(category => ({
            name: category,
            count: categoryCount[category],
          }));

          setCategoryData(categoryChartData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data
            .filter(order => order.orderstatus === true)
            .map(order => ({
              date: new Date(order.orderDate).toLocaleDateString(),
              totalPrice: order.totalPrice,
            }));

          const revenueByDate = {};
          data.forEach(order => {
            if (revenueByDate[order.date]) {
              revenueByDate[order.date] += order.totalPrice;
            } else {
              revenueByDate[order.date] = order.totalPrice;
            }
          });

          const revenueChartData = Object.keys(revenueByDate).map(date => ({
            date,
            totalPrice: revenueByDate[date],
            profit: revenueByDate[date] * 0.15,
          }));

          setRevenueData(revenueChartData);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
    fetchCategories();
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        console.error('Error signing in:', result.error);
      } else {
        console.log('Signed in successfully');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-blue-950 flex justify-center items-center flex-col gap-[5px]">
        <h2 className="text-[30px] font-bold text-center text-white">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-2 rounded"
          />
          <button type="submit" className="text-black py-2 bg-white rounded-lg hover:bg-gray-300 transition-colors">
            Sign in as Admin
          </button>
        </form>
        <h2 className="text-[30px] font-bold text-center text-white">OR</h2>
        <button onClick={() =>signIn('google')}
          className="text-black py-2 bg-white rounded-lg hover:bg-gray-300 transition-colors w-[18%]  h-[40px] flex justify-center items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.09 0 5.49 1.26 7.15 2.3L35.68 7C32.23 4.67 28.39 3.5 24 3.5 14.73 3.5 6.88 9.83 3.34 18.03l6.54 5.07C11.65 17.33 17.37 13.5 24 13.5"></path>
            <path fill="#34A853" d="M10.95 27.16C9.85 24.36 9.5 21.12 9.5 17.5c0-1.76.26-3.47.7-5.1L3.3 7.17C1.28 11.45 0 16.58 0 22c0 5.06 1.17 9.81 3.3 13.83l7.65-6.04"></path>
            <path fill="#FBBC05" d="M10.95 27.16l-7.65 6.04C6.73 40.91 14.42 46.5 24 46.5c5.12 0 9.9-1.55 13.65-4.19L30.14 36.7C27.38 38.68 24.08 39.5 24 39.5c-6.73 0-12.7-4.68-14.05-12.34"></path>
            <path fill="#4285F4" d="M47.5 24.5c0-1.2-.11-2.38-.33-3.5H24v7h13.32c-.61 3.23-2.66 5.97-5.32 7.63L41.35 41C45.92 37.47 48 31.65 48 24.5"></path>
          </svg>
          Sign in with Google
        </button>
      </main>
    );
  }
    return (
      <>
        <Navbar />
        <main className="w-[100vw] h-[80vh] flex">
          <div className="w-[20%]"><Sidebar /></div>
          <div className="bg-white w-[80%] h-full flex flex-col p-4 text9-blue-50">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setViewMode('revenue')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg "
              >
                Show Revenue
              </button>
              <button
                onClick={() => setViewMode('categories')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Show Categories
              </button>
              <button
                onClick={() => setViewMode('products')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Show Products
              </button>
            </div>
            {viewMode === 'revenue' ? (
              <RevenueChartComponent data={revenueData} />
            ) : viewMode === 'categories' ? (
              <CategoryChartComponent data={categoryData} />
            ) : (
              <ProductChartComponent data={productData} />
            )}
          </div>
        </main>
      </>
    );
  }
"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChartComponent from '@/app/Components/chart';

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState('orders');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setOrders(response.data);
          const data = response.data.map(order => ({
            label: new Date(order.orderDate).toLocaleDateString(),
            value: order.totalPrice,
          }));
          setChartData(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const response = await axios.put('/api/orders', {
        id,
        orderstatus: !currentStatus,
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, orderstatus: !currentStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status:', response.data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 w-full h-[80vh] overflow-scroll overflow-x-hidden">
      <div className="flex gap-5 mb-4">
        <button
          onClick={() => setViewMode('chart')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Show Orders Stats
        </button>
        <button
          onClick={() => setViewMode('orders')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg  hover:bg-blue-600"
        >
          Show Orders
        </button>
      </div>
      {viewMode === 'chart' ? (
        <ChartComponent data={chartData} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">Order ID: {order._id}</h2>
              <p><strong>Customer Name:</strong> {order.customerName}</p>
              <p><strong>Customer Email:</strong> {order.customerEmail}</p>
              <p><strong>Customer Address:</strong> {order.customerAddress}</p>
              <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <h3 className="text-lg font-semibold mt-4">Order Items:</h3>
              <ul className="list-none list">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="ml-4">
                    <p><strong>Item Name:</strong> {item.name}</p>
                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleStatusChange(order._id, order.orderStatus)}
                className={`mt-4 px-4 py-2 rounded-lg ${
                  order.orderstatus ? 'bg-green-500' : 'bg-red-500'
                } text-white`}
              >
                {order.orderstatus ? 'Completed' : 'Pending'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
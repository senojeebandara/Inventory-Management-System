import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newLoyaltyCustomers, setNewLoyaltyCustomers] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const weeklyRevenueData = [
    { day: "Mon", sales1: 40, sales2: 20 },
    { day: "Tue", sales1: 80, sales2: 30 },
    { day: "Wed", sales1: 50, sales2: 60 },
    { day: "Thu", sales1: 70, sales2: 40 },
    { day: "Fri", sales1: 90, sales2: 20 },
    { day: "Sat", sales1: 100, sales2: 80 },
    { day: "Sun", sales1: 60, sales2: 40 },
  ];


  useEffect(() => {
    // Fetch all products from the backend API
    axios.get("http://localhost:8081/products")
      .then(response => {
        setProducts(response.data);
        
        // Filter products with quantity less than 5 (low stock)
        const lowStock = response.data.filter(product => product.quantity < 5);
        setLowStockItems(lowStock);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  

     // Fetch new loyalty customers registered this week
  axios.get("http://localhost:8081/customers/new-loyalty-customers")
  .then(response => {
    setNewLoyaltyCustomers(response.data); // Assuming the response is just the count of new customers
  })
  .catch(error => {
    console.error("Error fetching new loyalty customers:", error);
  });

}, []); 


    return (
      <div className="p-6 bg-gray100 min-h-screen">
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Sale", value: "$2345" },
          { label: "Average Order Value", value: "$25" },
          { label: "New Orders", value: "2543" },
          { label: "New Loyalty Customers", value: newLoyaltyCustomers },
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-md border-2 border-black flex justify-between items-center"> 
            <p className="text-gray-600 text-left w-22">{item.label}</p>
            <p className="text-green-800 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

        
      {/* Revenue & Best Sellers */}
      <div className="grid grid-cols-5 gap-6 ">
        {/* Weekly Revenue Chart */}
        <div className="bg-white text-black p-5 rounded-2xl shadow-md pt-0 pr-0 pl-0 border-2 border-black flex flex-col items-center col-span-3">
          <h2 className="bg-black text-white p-5 rounded-t-xl shadow-md text-xl mb-3 text-center h-14 font-serif w-full">Weekly Revenue</h2>
          <ResponsiveContainer width="70%" height={200}>
            <BarChart data={weeklyRevenueData} barSize={18}>
              <XAxis dataKey="day" stroke="#000" />
              <Tooltip />
              <Bar dataKey="sales1" fill="#FFA500 " />
              <Bar dataKey="sales2" fill="#FF0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Best Sellers */}
        <div className="bg-white text-black p-5 rounded-2xl shadow-md pt-0 pr-0 pl-0 border-2 border-black flex flex-col col-span-2">
          <h2 className="bg-black text-white p-5 rounded-t-xl shadow-md text-xl mb-3 text-center h-14 font-serif w-full">Best Sellers</h2>
          <div className="grid grid-cols-3 ">
            {[
              { name: "Frock", sold: 36, image: "/images/b3a84bf4434428baad3b83c4ef10cc04.jpg" },
              { name: "Sneakers", sold: 34, image: "/images/8faaa776bb0654eb4794676a56fbe3cc.jpg"  },
              { name: "Jeans", sold: 30, image: "/images/fc4090924e57415f74cd770c1f6c0f38.jpg" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <img src={item.image} alt={item.name} className="mx-auto w-28 h-40 " />
                <p>{item.name}</p>
                <p className="text-sm">{item.sold} items sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Items */}
      <div className="grid grid-cols-6 gap-6 mt-6">

            
        {/* Low Stock Items */}
       <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-2">Low Stock Items</h2>
          <div className="bg-white p-4 rounded-2xl shadow-md ">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b">
                  {["ID", "Name", "Quantity"].map((heading) => (
                    <th key={heading} className="py-2">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.id}</td>
                      <td>{item.name}</td>
                      <td className="text-red-500">{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-2">No low stock items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      

        {/* Recent Orders */}
        <div className="col-span-4">
        <div>
          <h2 className="text-xl font-semibold mb-2 ">Recent Orders</h2>
          <div className="bg-white p-4 rounded-2xl shadow-md col-span-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b ">
                  {["Invoice", "Amount", "Date", "Phone no", "Cashier"].map((heading) => (
                    <th key={heading} className="py-2">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">#100{index + 1}</td>
                    <td>$100</td>
                    <td>2025-03-27</td>
                    <td>+123456789</td>
                    <td>John</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        </div>



      </div>
    );
  };
  
  export default Dashboard;
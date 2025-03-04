import React, { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, 
  ResponsiveContainer 
} from "recharts";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className="text-center p-4">Loading...</div>;

  // Transform data for charts
  const categoryData = stats.productsPerCategory.map(cat => ({
    name: cat.category,
    count: cat.count
  }));

  const topCategories = stats.topCategories.map(cat => ({
    name: cat._id,
    count: cat.count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="w-11/12 mx-auto space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold">{stats.numProducts}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Categories</h2>
          <p className="text-3xl font-bold">{stats.numCategories}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Recently Added Products</h2>
          <ul className="space-y-2">
            {stats.recentlyAddedProducts.map(product => (
              <li key={product._id} className="text-sm truncate">
                {product.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Products per Category */}
        <div className="bg-white shadow-md rounded-lg p-4 h-[400px]">
          <h2 className="text-lg font-semibold mb-2">Products per Category</h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-[400px]">
          <h2 className="text-lg font-semibold mb-2">Category Distribution</h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={topCategories}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {topCategories.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow-md rounded-lg p-4 hidden lg:block">
        <h2 className="text-lg font-semibold mb-4">Recently Added Product Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Barcode</th>
                <th className="border p-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentlyAddedProducts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border p-2">{product.description}</td>
                  <td className="border p-2">{product.barcode}</td>
                  <td className="border p-2">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
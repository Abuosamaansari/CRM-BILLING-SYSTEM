import React, { useEffect, useState } from 'react';
import { getStockSummery } from '../Api/apiServices'; // adjust path as needed

const StockSummary = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStockSummery()
      .then((res) => {
        setStockData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stock summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Stock Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockData.map((item) => (
          <div
            key={item.product_id}
            className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.productname}
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Item Code:</span> {item.itemcode}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Quantity:</span> {item.qntyyy}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Category:</span> {item.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Warehouse:</span> {item.warehouse || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockSummary;

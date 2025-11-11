import React from 'react';

const VendorProductTable = ({ products, selectedIds, setSelectedIds }) => {
  const toggleCheckbox = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">
              {/* You can add "select all" logic here later */}
              <input type="checkbox" disabled />
            </th>
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">HSN Code</th>
            <th className="p-2 border">Item Code</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Subcategory</th>
            <th className="p-2 border">Vendor</th>
            <th className="p-2 border">Serial Numbers</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(prod.id)}
                  onChange={() => toggleCheckbox(prod.id)}
                />
              </td>
              <td className="p-2 border">{prod.productname}</td>
              <td className="p-2 border">{prod.hsncode}</td>
              <td className="p-2 border">{prod.itemcode}</td>
              <td className="p-2 border">{prod.price}</td>
              <td className="p-2 border">{prod.category_name}</td>
              <td className="p-2 border">{prod.subcategory_name}</td>
              <td className="p-2 border">{prod.vendor_name || '-'}</td>
              <td className="p-2 border whitespace-pre-wrap text-sm">
                {Array.isArray(prod.serial_numbers) && prod.serial_numbers.length > 0
                  ? prod.serial_numbers.join(', ')
                  : '—'}
              </td>
              <td className="p-2 border">
                {prod.created_at
                  ? new Date(prod.created_at).toLocaleDateString()
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorProductTable;



import React, { useEffect, useState } from 'react';
import { getAllVendors, getAllProducts, createPO } from '../Api/apiServices';

const CreatePurchaseOrder = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    vendor_id: '',
    po_number: '',
    order_date: '',
    remarks: '',
  });

  const [items, setItems] = useState([
    { product_id: '', quantity: '', purchase_price: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch vendors
    getAllVendors()
      .then((res) => {
        setVendors(res.data?.data || res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching vendors:', err);
        setVendors([]);
      });

    // Fetch products
    getAllProducts()
      .then((res) => {
        setProducts(res.data?.data || res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setProducts([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: '', purchase_price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return; // Prevent removing last item
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // Wrap formData inside poData as backend expects
      const payload = {
        poData: { ...formData },
        items,
      };
      await createPO(payload);
      setSuccess('Purchase Order created successfully!');
      setFormData({
        vendor_id: '',
        po_number: '',
        order_date: '',
        remarks: '',
      });
      setItems([{ product_id: '', quantity: '', purchase_price: '' }]);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to create Purchase Order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Purchase Order</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PO Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Vendor</label>
            <select
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option
                  key={v.id || v.vendor_id}
                  value={v.id || v.vendor_id}
                >
                  {v.vendorename || v.vendor_name || v.name || v.company_name || `Vendor ${v.id || v.vendor_id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">PO Number</label>
            <input
              type="text"
              name="po_number"
              value={formData.po_number}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Order Date</label>
            <input
              type="date"
              name="order_date"
              value={formData.order_date}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3">
              <select
                name="product_id"
                value={item.product_id}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="col-span-2 border rounded px-3 py-2"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productname}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                name="purchase_price"
                placeholder="Price"
                value={item.purchase_price}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="border rounded px-3 py-2"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="text-red-600 font-semibold"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + Add Item
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Creating PO...' : 'Submit Purchase Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;

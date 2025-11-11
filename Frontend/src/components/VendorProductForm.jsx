import React, { useEffect, useState } from 'react';

const VendorProductForm = ({ onClose, onSave, categories, vendors, product }) => {
  const [form, setForm] = useState({
    productname: '',
    hsncode: '',
    itemcode: '',
    price: '',
    discount: '',
    gst: '',
    igst: '',
    cgst: '',
    sgst: '',
    category_id: '',
    subcategory_id: '',
    vendor_id: '',
    serial_numbers: [],
  });

  const [subcategories, setSubcategories] = useState([]);
  const [newSerial, setNewSerial] = useState('');

  // ✅ Auto-fill form on edit & detect category from subcategory if needed
  useEffect(() => {
    if (product) {
      let categoryId = product.category_id;

      if (!categoryId && product.subcategory_id && categories.length > 0) {
        for (const cat of categories) {
          if (cat.subcategories?.some(sub => sub.id === product.subcategory_id)) {
            categoryId = cat.id;
            break;
          }
        }
      }

      setForm({
        ...product,
        category_id: categoryId || '',
        subcategory_id: product.subcategory_id || '',
        vendor_id: product.vendor_id || '',
        serial_numbers: product.serial_numbers || [],
      });
    } else {
      setForm({
        productname: '',
        hsncode: '',
        itemcode: '',
        price: '',
        discount: '',
        gst: '',
        igst: '',
        cgst: '',
        sgst: '',
        category_id: '',
        subcategory_id: '',
        vendor_id: '',
        serial_numbers: [],
      });
      setSubcategories([]);
    }
  }, [product, categories]);

  // ✅ Update subcategories based on selected category
  useEffect(() => {
    if (form.category_id) {
      const selectedCat = categories.find(cat => Number(cat.id) === Number(form.category_id));
      setSubcategories(selectedCat ? selectedCat.subcategories || [] : []);
    } else {
      setSubcategories([]);
    }
  }, [form.category_id, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: ['category_id', 'subcategory_id', 'vendor_id'].includes(name) ? Number(value) : value,
    }));

    if (name === 'category_id') {
      setForm(prev => ({ ...prev, subcategory_id: '' }));
    }
  };

  const addSerialNumber = () => {
    if (newSerial && !form.serial_numbers.includes(newSerial)) {
      setForm(prev => ({ ...prev, serial_numbers: [...prev.serial_numbers, newSerial] }));
      setNewSerial('');
    }
  };

  const removeSerial = (sn) => {
    setForm(prev => ({
      ...prev,
      serial_numbers: prev.serial_numbers.filter(s => s !== sn),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          {product ? 'Update Product' : 'Add Vendor Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="productname"
              value={form.productname}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-2 rounded"
              required
            />

            <input
              name="hsncode"
              value={form.hsncode}
              onChange={handleChange}
              placeholder="HSN Code"
              className="border p-2 rounded"
            />

            <input
              name="itemcode"
              value={form.itemcode}
              onChange={handleChange}
              placeholder="Item Code"
              className="border p-2 rounded"
            />

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />

            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
              placeholder="Discount"
              className="border p-2 rounded"
            />

            <input
              name="gst"
              type="number"
              value={form.gst}
              onChange={handleChange}
              placeholder="GST"
              className="border p-2 rounded"
            />

            <input
              name="igst"
              type="number"
              value={form.igst}
              onChange={handleChange}
              placeholder="IGST"
              className="border p-2 rounded"
            />

            <input
              name="cgst"
              type="number"
              value={form.cgst}
              onChange={handleChange}
              placeholder="CGST"
              className="border p-2 rounded"
            />

            <input
              name="sgst"
              type="number"
              value={form.sgst}
              onChange={handleChange}
              placeholder="SGST"
              className="border p-2 rounded"
            />

            {/* ✅ Category Dropdown */}
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* ✅ Subcategory Dropdown */}
            <select
              name="subcategory_id"
              value={form.subcategory_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              disabled={!form.category_id}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.subvariant_name}</option>
              ))}
            </select>

            {/* ✅ Vendor Dropdown */}
            <select
              name="vendor_id"
              value={form.vendor_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Vendor</option>
              {Array.isArray(vendors?.data) && vendors.data.map(v => (
                <option key={v.id} value={v.id}>{v.vendorename}</option>
              ))}
            </select>
          </div>

          {/* ✅ Serial Numbers */}
          <div>
            <div className="flex gap-2 mb-2">
              <input
                value={newSerial}
                onChange={(e) => setNewSerial(e.target.value)}
                placeholder="Enter Serial Number"
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={addSerialNumber}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.serial_numbers.map((sn, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                >
                  {sn}
                  <button
                    type="button"
                    onClick={() => removeSerial(sn)}
                    className="ml-2 text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {product ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProductForm;

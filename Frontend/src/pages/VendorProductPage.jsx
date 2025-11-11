

import React, { useEffect, useState } from 'react';
import {
  getAllVendorProducts,
  deleteVendorProductById,
  getAllCategories,
  getAllVendors,
  addVendorProduct,
  updateVendorProductById,
} from '../Api/apiServices';

import VendorProductForm from '../components/VendorProductForm';
import VendorProductTable from '../components/VendorProductTable';

const VendorProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [prodRes, catRes, venRes] = await Promise.all([
      getAllVendorProducts(),
      getAllCategories(),
      getAllVendors(),
    ]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
    // console.log('Categories:', catRes.data);
    setVendors(venRes.data);
    // console.log('Products:', venRes.data);
  };

  const handleDelete = async () => {
    for (let id of selectedIds) {
      await deleteVendorProductById(id);
    }
    setSelectedIds([]);
    fetchData();
  };

  const handleSave = async (formData) => {
    if (editingProduct) {
      await updateVendorProductById(editingProduct.id, formData);
    } else {
      await addVendorProduct(formData);
    }
    setShowForm(false);
    setEditingProduct(null);
    fetchData();
  };

  const filteredProducts = products.filter(p =>
    p.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* 🔍 Top Search & Actions */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search Product..."
          className="border p-2 w-full sm:w-60 rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
          >
            Add Vendor Product
          </button>

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => {
              const prod = products.find(p => p.id === selectedIds[0]);
              setEditingProduct(prod);
              setShowForm(true);
            }}
            disabled={selectedIds.length !== 1}
          >
            Update
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
          >
            Delete
          </button>
        </div>
      </div>

      {/* 📦 Product Table */}
      <VendorProductTable
        products={filteredProducts}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />

      {/* 📝 Form Modal */}
      {showForm && (
        <VendorProductForm
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
          categories={categories}
          vendors={vendors}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default VendorProductsPage;


import { useEffect, useState } from "react";
import {
  getAllProducts,
  addSimpleProduct,
  updateProductById,
  deleteProductById,
} from "../Api/apiServices";
import ProductForm from "../components/ProductForm";
import Layout from "../components/Sidebar";

const ITEMS_PER_PAGE = 10;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetch = () => {
    getAllProducts()
      .then((res) => {
        console.log("API response:", res.data);
        const result = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setProducts(result);
      })
      .catch(console.error);
  };

  useEffect(fetch, []);

  const filtered = Array.isArray(products)
    ? products.filter((p) =>
        p.productname?.toLowerCase().includes(search.toLowerCase()) ||
        p.itemcode?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    const ids = paginated.map((p) => p.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length && confirm("Delete selected products?")) {
      Promise.all(selectedIds.map(deleteProductById)).then(() => {
        setSelectedIds([]);
        fetch();
      });
    }
  };

  const handleSave = (data) => {
    const isDuplicate = products.some(
      (p) => p.itemcode === data.itemcode && p.id !== selectedProduct?.id
    );
    if (isDuplicate) {
      alert("Item code already exists!");
      return;
    }

    // Cast types correctly for API
    const payload = {
      ...data,
      qntyyy: Number(data.qntyyy),
      price: Number(data.price),
      discount: Number(data.discount),
      cgst: Number(data.cgst),
      sgst: Number(data.sgst),
      igst: Number(data.igst),
      category_id: Number(data.category_id),
      warehouse_id: Number(data.warehouse_id),
      is_vendor_product: Boolean(data.is_vendor_product),
    };

    const api = selectedProduct
      ? updateProductById(selectedProduct.id, payload)
      : addSimpleProduct(payload);

    api
      .then(() => {
        setShowForm(false);
        setSelectedProduct(null);
        fetch();
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("Failed to save product. Check all fields and try again.");
      });
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Layout />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name or itemcode ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={paginated.every((p) => selectedIds.includes(p.id))}
                onChange={toggleSelectAll}
              />
              Select All
            </label>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
            >
              ➕ Add Product
            </button>

            <button
              onClick={() => {
                const productToEdit = products.find((p) => p.id === selectedIds[0]);
                setSelectedProduct(productToEdit);
                setShowForm(true);
              }}
              disabled={selectedIds.length !== 1}
              className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
            >
              📝 Edit
            </button>

            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              🗑 Delete
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">itemcode</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((prod) => (
                <tr
                  key={prod.id}
                  className={`border-t ${
                    selectedIds.includes(prod.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prod.id)}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(prod.id)
                            ? prev.filter((id) => id !== prod.id)
                            : [...prev, prod.id]
                        );
                      }}
                    />
                  </td>
                  <td className="p-2">{prod.productname}</td>
                  <td className="p-2">{prod.itemcode}</td>
                  <td className="p-2">
                    {prod.category_name || prod.category?.name || "—"}
                  </td>
                  <td className="p-2">{prod.price}</td>
                  <td className="p-2">{prod.qntyyy}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            ⬅ Previous
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>

        {showForm && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
            onClick={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
              >
                &times;
              </button>
              <ProductForm
                initial={selectedProduct}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                existingItemCodes={products.map((p) => p.itemcode)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;

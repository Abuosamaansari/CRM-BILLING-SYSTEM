import { useState, useEffect } from "react";
import { getAllCategories } from "../Api/apiServices";

const ProductForm = ({ initial, onSubmit, onCancel, existingItemCodes = [] }) => {
  const [form, setForm] = useState({
    productname: "",
    itemcode: "",
    hsncode: "",
    qntyyy: 0,
    price: "",
    discount: "",
    cgst: "",
    sgst: "",
    igst: "",
    category_id: "",
    warehouse_id: "",
    is_vendor_product: false,
  });

  const [categories, setCategories] = useState([]);
  const [skuError, setSkuError] = useState("");

  useEffect(() => {
    getAllCategories()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initial) setForm((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "itemcode") {
      const isDuplicate =
        existingItemCodes.includes(value) &&
        (!initial || value !== initial.itemcode);
      setSkuError(isDuplicate ? "Item code already exists" : "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skuError) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-4 max-h-[90vh] overflow-y-auto w-full max-w-3xl"
    >
      <h2 className="text-2xl font-bold">
        {initial ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Product Name", "productname"],
          ["SKU / Item Code", "itemcode"],
          ["HSN Code", "hsncode"],
          ["Quantity", "qntyyy", "number"],
          ["Price", "price", "number"],
          ["Discount %", "discount", "number"],
          ["CGST %", "cgst", "number"],
          ["SGST %", "sgst", "number"],
          ["IGST %", "igst", "number"],
        ].map(([label, name, type = "text"]) => (
          <label key={name} className="block">
            <span className="font-medium">{label}</span>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              type={type}
              required
              className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
            />
            {name === "itemcode" && skuError && (
              <span className="text-red-600 text-sm">{skuError}</span>
            )}
          </label>
        ))}

        <label className="block col-span-full">
          <span className="font-medium">Category</span>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block col-span-full">
          <span className="font-medium">Warehouse ID</span>
          <input
            name="warehouse_id"
            value={form.warehouse_id}
            onChange={handleChange}
            type="number"
            required
            className="mt-1 w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
          />
        </label>

        <label className="flex items-center gap-2 col-span-full">
          <input
            type="checkbox"
            name="is_vendor_product"
            checked={form.is_vendor_product}
            onChange={handleChange}
          />
          <span className="font-medium">Is Vendor Product?</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={!!skuError}
        >
          {initial ? "Update" : "Add"} Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

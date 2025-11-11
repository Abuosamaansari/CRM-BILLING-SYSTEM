import { useEffect, useState } from "react";
import {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} from "../Api/apiServices";
import CustomerForm from "../components/CustomerForm";
import Layout from "../components/Sidebar";

const ITEMS_PER_PAGE = 10;

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await getAllCustomers();
      setCustomers(res.data.data || res.data);
      console.log("Customers fetched successfully:", res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filtered = customers.filter((c) =>
    [c.customer_name, c.email].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    const ids = paginated.map((c) => c.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const handleDeleteSelected = async () => {
    if (
      selectedIds.length &&
      window.confirm("Are you sure you want to delete selected customers?")
    ) {
      await Promise.all(selectedIds.map((id) => deleteCustomer(id)));
      setSelectedIds([]);
      fetchCustomers();
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, data);
      } else {
        await registerCustomer(data);
      }
      setShowForm(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Layout />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>

        {/* Top Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border px-4 py-2 rounded w-full md:w-1/3"
            value={search}
            onChange={handleSearch}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  paginated.length > 0 &&
                  paginated.every((c) => selectedIds.includes(c.id))
                }
                onChange={toggleSelectAll}
              />
              Select All
            </label>

            <button
              onClick={() => {
                setSelectedCustomer(null);
                setShowForm(true);
              }}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
            >
              ➕ New Customer
            </button>

            <button
              onClick={() => {
                const customer = customers.find(
                  (c) => c.id === selectedIds[0]
                );
                setSelectedCustomer(customer);
                setShowForm(true);
              }}
              disabled={selectedIds.length !== 1}
              className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
            >
              📝 Edit
            </button>

            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={selectedIds.length === 0}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Contact Person</th>
                <th className="p-2 border">Address</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((customer) => (
                <tr
                  key={customer.id}
                  className={`border-t hover:bg-gray-50 ${
                    selectedIds.includes(customer.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(customer.id)
                            ? prev.filter((id) => id !== customer.id)
                            : [...prev, customer.id]
                        )
                      }
                    />
                  </td>
                  <td className="p-2">{customer.customer_name}</td>
                  <td className="p-2">{customer.email}</td>
                  <td className="p-2">{customer.phone_number}</td>
                  <td className="p-2">{customer.contact_person_1_name}</td>
                  <td className="p-2">
                    {[customer.address_1, customer.city, customer.state, customer.postal_code, customer.country]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-4">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Previous
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => {
              setShowForm(false);
              setSelectedCustomer(null);
            }}
          >
            <div
              className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedCustomer(null);
                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl transition"
              >
                &times;
              </button>

              <CustomerForm
                initial={selectedCustomer}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedCustomer(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerPage;

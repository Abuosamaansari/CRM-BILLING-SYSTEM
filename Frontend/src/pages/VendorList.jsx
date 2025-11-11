import { useEffect, useState } from "react";
import {
  getAllVendors,
  deleteVendor,
  updateVendor,
  registerVendor,
} from "../Api/apiServices";
import VendorForm from "../components/VendorForm";

const ITEMS_PER_PAGE = 10;

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await getAllVendors();
      setVendors(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredVendors = vendors.filter((v) =>
    [v.vendorename, v.email].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    const ids = paginatedVendors.map((v) => v.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const handleDeleteSelected = async () => {
    if (
      selectedIds.length > 0 &&
      window.confirm("Delete selected vendors?")
    ) {
      await Promise.all(selectedIds.map((id) => deleteVendor(id)));
      setSelectedIds([]);
      fetchVendors();
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedVendor) {
        await updateVendor(selectedVendor.id, formData);
      } else {
        await registerVendor(formData);
      }
      setShowForm(false);
      setSelectedVendor(null);
      fetchVendors();
    } catch (err) {
      console.error("Error saving vendor:", err);
    }
  };

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>

      {/* Top Control Panel */}
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
                paginatedVendors.length > 0 &&
                paginatedVendors.every((v) => selectedIds.includes(v.id))
              }
              onChange={toggleSelectAll}
            />
            Select All
          </label>

          <button
            onClick={() => {
              setSelectedVendor(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            ➕ Register Vendor
          </button>

          <button
            onClick={() => {
              const vendor = vendors.find((v) => v.id === selectedIds[0]);
              setSelectedVendor(vendor);
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

      {/* Vendor Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Contact Person</th>
              <th className="p-2 border">Business Type</th>
              <th className="p-2 border">Website</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className={`border-t hover:bg-gray-50 ${
                  selectedIds.includes(vendor.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(vendor.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(vendor.id)
                          ? prev.filter((id) => id !== vendor.id)
                          : [...prev, vendor.id]
                      )
                    }
                  />
                </td>
                <td className="p-2">{vendor.vendorename}</td>
                <td className="p-2">{vendor.email}</td>
                <td className="p-2">{vendor.phone_number}</td>
                <td className="p-2">
                  {vendor.contact_person_name} - {vendor.contact_person_number}
                </td>
                <td className="p-2">{vendor.business_type}</td>
                <td className="p-2">
                  {vendor.website ? (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {paginatedVendors.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-4">
                  No vendors found.
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
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>

      {/* Vendor Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <VendorForm
            initial={selectedVendor}
            onSubmit={handleSave}
            onCancel={() => {
              setShowForm(false);
              setSelectedVendor(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VendorPage;

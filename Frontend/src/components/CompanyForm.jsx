import React, { useState, useEffect } from 'react';
import {
  createCompany,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById
} from '../Api/apiServices';

const initialState = {
  name: '',
  registration_number: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  postal_code: '',
  email: '',
  phone: '',
  website: '',
  logo_url: '',
  industry_type: '',
};

const CompanyForm = ({ selectedId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      getCompanyById(selectedId)
        .then(setFormData)
        .catch(() => setError('Failed to load company data'))
        .finally(() => setLoading(false));
    } else {
      setFormData(initialState);
    }
  }, [selectedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append('logo', file);

    try {
      const response = await fetch('http://localhost:4000/api/uploadLogo', {
        method: 'POST',
        body: formDataFile,
      });
      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, logo_url: data.logoUrl }));
      } else {
        alert('Failed to upload image: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Company Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      alert('Email is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (selectedId) {
        await updateCompanyById(selectedId, formData);
        onSuccess(selectedId);
      } else {
        const res = await createCompany(formData);
        onSuccess(res.data.id);
      }
      setFormData(initialState);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId && confirm('Are you sure you want to delete this company?')) {
      setLoading(true);
      try {
        await deleteCompanyById(selectedId);
        onSuccess(null);
        setFormData(initialState);
      } catch {
        alert('Failed to delete company');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-lg max-w-5xl mx-auto mb-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        {selectedId ? 'Edit Company' : 'Create New Company'}
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="mb-4">Processing...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Company Name', name: 'name' },
          { label: 'GST Number', name: 'registration_number' },
          { label: 'Email', name: 'email' },
          { label: 'Phone', name: 'phone' },
          { label: 'Website', name: 'website' },
          { label: 'Industry Type', name: 'industry_type' },
          { label: 'Postal Code', name: 'postal_code' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'Country', name: 'country' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Company Logo
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {formData.logo_url && (
            <img
              src={`http://localhost:4000${formData.logo_url}`}
              alt="Company Logo"
              className="mt-2 h-20 w-20 rounded-full object-cover"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded text-white transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {selectedId ? 'Update' : 'Create'}
        </button>

        {selectedId && (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`px-5 py-2 rounded text-white transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Delete
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={`px-5 py-2 rounded text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all`}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default CompanyForm;

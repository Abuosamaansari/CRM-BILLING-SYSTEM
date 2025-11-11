import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  getProfile,
  
  updateProfile,
  deleteProfile,
} from '../Api/apiServices';
import 'react-toastify/dist/ReactToastify.css';
 import {createProfile} from '../Api/profile'
  import { useAuth } from '../utils/AuthContext';

export default function CompanyProfileForm() {
  const initial = {
    company_name: '',
    address_1: '',
    pin_code_1: '',
    state_name_1: '',
    state_gst_code_1: '',
    address_2: '',
    pin_code_2: '',
    state_name_2: '',
    state_gst_code_2: '',
    contact_person_1_name: '',
    contact_person_1_number: '',
    contact_person_2_name: '',
    contact_person_2_number: '',
    account_holder_1_name: '',
    bank_name_1: '',
    account_number_1: '',
    ifsc_code_1: '',
    account_holder_2_name: '',
    bank_name_2: '',
    account_number_2: '',
    ifsc_code_2: '',
    gst_number: '',
    pan_number: '',
    msme_number: '',
    cin_number: '',
    email: '',
    terms_and_conditions: '',
    invoice_prefix: '',
    invoice_start_number: '',
    current_invoice_number: '',
  };
  const { token, user } = useAuth();
     const id = user.id;

  const [formData, setFormData] = useState(initial);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const prof = res.data?.data || res.data;
        if (prof && prof.id) {
          setFormData({ ...prof });
          setProfileId(prof.id);
        } else {
          setFormData(initial);
          setProfileId(null);
        }
      })
      .catch(() => {
        setFormData(initial);
        setProfileId(null);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createProfile(token, id, formData)
      .then((res) => {
        setProfileId(res.data.id);
        toast.success('Profile Created');
      })
      .catch(() => toast.error('Error creating profile'));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!profileId) return toast.error('No profile to update');
    updateProfile(profileId, formData)
      .then(() => toast.success('Profile Updated'))
      .catch(() => toast.error('Error updating profile'));
  };

  const handleDelete = () => {
    if (!profileId) return toast.error('No profile to delete');
    deleteProfile(profileId)
      .then(() => {
        toast.success('Profile Deleted');
        setProfileId(null);
        setFormData(initial);
      })
      .catch(() => toast.error('Error deleting profile'));
  };

  const renderInput = (
    label,
    name,
    type = 'text',
    required = false,
    disabled = false
  ) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500 text-gray-900"
        required={required}
        disabled={disabled}
      />
    </div>
  );

  const nextInvoiceNumber =
    formData.invoice_prefix && formData.current_invoice_number
      ? `${formData.invoice_prefix}-${String(
          Number(formData.current_invoice_number) + 1
        ).padStart(4, '0')}`
      : '';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <ToastContainer position="top-right" />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">
          Company Profile
        </h2>

        {/* Company Information */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Company Name', 'company_name', 'text', true)}
            {renderInput('Email', 'email', 'email', true)}
          </div>
        </section>

        {/* Address */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Address Line 1', 'address_1', 'text', true)}
            {renderInput('Pin Code 1', 'pin_code_1', 'number', true)}
            {renderInput('State Name 1', 'state_name_1', 'text', true)}
            {renderInput('State GST Code 1', 'state_gst_code_1', 'text', true)}

            {renderInput('Address Line 2', 'address_2')}
            {renderInput('Pin Code 2', 'pin_code_2', 'number')}
            {renderInput('State Name 2', 'state_name_2', 'text')}
            {renderInput('State GST Code 2', 'state_gst_code_2', 'text')}
          </div>
        </section>

        {/* Contact Persons */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Contact Persons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Contact Person 1 Name', 'contact_person_1_name')}
            {renderInput(
              'Contact Person 1 Number',
              'contact_person_1_number',
              'tel'
            )}
            {renderInput('Contact Person 2 Name', 'contact_person_2_name')}
            {renderInput(
              'Contact Person 2 Number',
              'contact_person_2_number',
              'tel'
            )}
          </div>
        </section>

        {/* Bank Details */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Bank Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Account Holder 1 Name', 'account_holder_1_name')}
            {renderInput('Bank Name 1', 'bank_name_1')}
            {renderInput('Account Number 1', 'account_number_1')}
            {renderInput('IFSC Code 1', 'ifsc_code_1')}

            {renderInput('Account Holder 2 Name', 'account_holder_2_name')}
            {renderInput('Bank Name 2', 'bank_name_2')}
            {renderInput('Account Number 2', 'account_number_2')}
            {renderInput('IFSC Code 2', 'ifsc_code_2')}
          </div>
        </section>

        {/* Tax Details */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Tax & Registration Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('GST Number', 'gst_number', 'text', true)}
            {renderInput('PAN Number', 'pan_number', 'text', true)}
            {renderInput('MSME Number', 'msme_number')}
            {renderInput('CIN Number', 'cin_number')}
          </div>
        </section>

        {/* Invoice Settings */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Invoice Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('Invoice Prefix', 'invoice_prefix', 'text', true)}
            {renderInput(
              'Current Invoice Number',
              'invoice_start_number',
              'number',
              true
            )}
            {renderInput(
              'Invoice Start Number',
              'current_invoice_number',
              'number',
              true,
              profileId
            )}
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
            Terms & Conditions
          </h3>
          <textarea
            name="terms_and_conditions"
            value={formData.terms_and_conditions}
            onChange={handleChange}
            rows={4}
            placeholder="Enter terms and conditions here..."
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </section>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!profileId ? (
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition w-full sm:w-auto"
            >
              Create Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md transition w-full sm:w-auto"
              >
                Update Profile
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition w-full sm:w-auto"
              >
                Delete Profile
              </button>
            </>
          )}
        </div>

        {/* Next Invoice Number */}
        {nextInvoiceNumber && (
          <p className="mt-6 text-center text-lg font-semibold text-gray-700">
            Next Invoice Number:{' '}
            <span className="text-blue-600">{nextInvoiceNumber}</span>
          </p>
        )}
      </div>
    </div>
  );
}

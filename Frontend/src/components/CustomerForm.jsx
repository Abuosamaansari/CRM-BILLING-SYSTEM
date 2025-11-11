import { useEffect, useState } from "react";

const CustomerForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    customer_name: "",
    phone_number: "",
    email: "",
    gst_number: "",
    address_1: "",
    pin_code_1: "",
    state_name_1: "",
    state_gst_code_1: "",
    address_2: "",
    pin_code_2: "",
    state_name_2: "",
    state_gst_code_2: "",
    contact_person_1_name: "",
    contact_person_1_number: "",
    contact_person_2_name: "",
    contact_person_2_number: "",
    account_holder_1_name: "",
    bank_name_1: "",
    account_number_1: "",
    ifsc_code_1: "",
    account_holder_2_name: "",
    bank_name_2: "",
    account_number_2: "",
    ifsc_code_2: "",
    pan_number: "",
    msme_number: "",
    cin_number: "",
    terms_and_conditions: "",
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {initial ? "Edit Customer" : "Register Customer"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          ["Customer Name", "customer_name"],
          ["Phone Number", "phone_number"],
          ["Email", "email"],
          ["GST Number", "gst_number"],
          ["Address 1", "address_1"],
          ["PIN Code 1", "pin_code_1"],
          ["State Name 1", "state_name_1"],
          ["State GST Code 1", "state_gst_code_1"],
          ["Address 2", "address_2"],
          ["PIN Code 2", "pin_code_2"],
          ["State Name 2", "state_name_2"],
          ["State GST Code 2", "state_gst_code_2"],
          ["Contact Person 1 Name", "contact_person_1_name"],
          ["Contact Person 1 Number", "contact_person_1_number"],
          ["Contact Person 2 Name", "contact_person_2_name"],
          ["Contact Person 2 Number", "contact_person_2_number"],
          ["Account Holder 1 Name", "account_holder_1_name"],
          ["Bank Name 1", "bank_name_1"],
          ["Account Number 1", "account_number_1"],
          ["IFSC Code 1", "ifsc_code_1"],
          ["Account Holder 2 Name", "account_holder_2_name"],
          ["Bank Name 2", "bank_name_2"],
          ["Account Number 2", "account_number_2"],
          ["IFSC Code 2", "ifsc_code_2"],
          ["PAN Number", "pan_number"],
          ["MSME Number", "msme_number"],
          ["CIN Number", "cin_number"],
          ["Terms and Conditions", "terms_and_conditions"],
        ].map(([label, name]) => (
          <label key={name} className="block">
            <span className="text-gray-700 font-medium">{label}</span>
            {name === "terms_and_conditions" ? (
              <textarea
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-indigo-400"
                rows={3}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-4 py-2 shadow-sm focus:ring-indigo-400"
                required={
                  ![
                    "terms_and_conditions",
                    "address_2",
                    "contact_person_2_name",
                    "contact_person_2_number",
                    "account_holder_2_name",
                    "bank_name_2",
                    "account_number_2",
                    "ifsc_code_2",
                  ].includes(name)
                }
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {initial ? "Update" : "Add"} Customer
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;

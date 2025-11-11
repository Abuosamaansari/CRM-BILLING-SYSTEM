import { useEffect, useState } from "react";
const VendorForm = ({ initial, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        vendorename: "",
        email: "",
        phone_number: "",
        pan_number: "",
        landline: "",
        contact_person_name: "",
        contact_person_number: "",
        description: "",
        website: "",
        business_type: "",
        bank_name: "",
        bank_account_number: "",
        bank_ifsc: "",
        date_of_registration: "",
        address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "IN",
        },
    });

    useEffect(() => {
        if (initial) {
            setForm((prev) => ({
                ...prev,
                ...initial,
                address: {
                    ...prev.address,
                    ...(initial.address || {}),
                    country: initial.address?.country || "IN",
                },
            }));
        }
    }, [initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addrKey = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: { ...prev.address, [addrKey]: value },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded shadow p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
            <h2 className="text-xl font-semibold mb-4">
                {initial ? "Edit" : "Register"} Vendor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    "vendorename",
                    "email",
                    "phone_number",
                    "pan_number",
                    "landline",
                    "contact_person_name",
                    "contact_person_number",
                    "description",
                    "website",
                    "business_type",
                    "bank_name",
                    "bank_account_number",
                    "bank_ifsc",
                ].map((field) => (
                    <input
                        key={field}
                        name={field}
                        value={form[field] || ""}
                        onChange={handleChange}
                        placeholder={field.replace(/_/g, " ")}
                        className="border px-4 py-2 rounded w-full"
                        required={field !== "description" && field !== "website"} // optional fields example
                    />
                ))}

                {/* Date input */}
                <input
                    key="date_of_registration"
                    name="date_of_registration"
                    type="date"
                    value={form.date_of_registration || ""}
                    onChange={handleChange}
                    placeholder="Date of registration"
                    className="border px-4 py-2 rounded w-full"
                    required
                />

                {/* Address Inputs */}
                {[
                    "line1",
                    "line2",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                ].map((field) => (
                    <input
                        key={field}
                        name={`address.${field}`}
                        value={form.address[field] || ""}
                        onChange={handleChange}
                        placeholder={`Address ${field}`}
                        className="border px-4 py-2 rounded w-full"
                        required={field !== "line2"} // example: line2 optional
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {initial ? "Update" : "Add"} Vendor
                </button>
            </div>
        </form>
    );
};

export default VendorForm;





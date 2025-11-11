

// // src/components/VendorCard.jsx
// const VendorCard = ({ vendor, onEdit, onDelete }) => {
//     return (
//       <div className="bg-white rounded shadow p-6 space-y-3 border border-gray-200 hover:shadow-lg transition-shadow">
//         <h3 className="text-xl font-semibold">{vendor.vendorename}</h3>
//         <div className="text-gray-700 space-y-1">
//           <p><strong>Email:</strong> {vendor.email || "-"}</p>
//           <p><strong>Phone:</strong> {vendor.phone_number || "-"}</p>
//           <p>
//             <strong>Contact Person:</strong> {vendor.contact_person_name || "-"} - {vendor.contact_person_number || "-"}
//           </p>
//           <p><strong>Business Type:</strong> {vendor.business_type || "-"}</p>
//           <p><strong>Website:</strong> 
//             {vendor.website ? (
//               <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                 {vendor.website}
//               </a>
//             ) : "-"}
//           </p>
//           <p><strong>Address:</strong> {[
//             vendor.address_line1,
//             vendor.address_line2,
//             vendor.city,
//             vendor.state,
//             vendor.postal_code,
//             vendor.country
//           ].filter(Boolean).join(", ") || "-"}</p>
//           <p><strong>Date of Registration:</strong> {vendor.date_of_registration || "-"}</p>
//         </div>
  
//         <div className="flex justify-end gap-4 mt-4">
//           <button
//             onClick={() => onEdit(vendor)}
//             className="px-3 py-1 rounded bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(vendor.id)}
//             className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   export default VendorCard;
  



import React from 'react'

const VendorCard = () => {
  return (
    <div>VendorCard</div>
  )
}

export default VendorCard
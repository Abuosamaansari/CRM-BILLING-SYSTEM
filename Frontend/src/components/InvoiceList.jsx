// import React from 'react';

// const InvoiceList = ({
//   invoices,
//   customers = [],  // default empty array to avoid undefined
//   onEdit,
//   onSelect,
//   selectedInvoices = [],
//   onDeleteSelected,
// }) => {
//   // Safely get customer name by id
//   const getCustomerName = (customer_id) => {
//     if (!customers || !Array.isArray(customers)) return 'N/A';
//     const customer = customers.find(c => c.id === customer_id);
//     return customer ? customer.customer_name : 'N/A';
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-200 rounded">
//         <thead>
//           <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//             <th className="p-2 border-r border-gray-300 w-12">
//               <input
//                 type="checkbox"
//                 onChange={e => {
//                   if (e.target.checked) {
//                     onSelect(invoices.map(inv => inv.id));
//                   } else {
//                     onSelect([]);
//                   }
//                 }}
//                 checked={
//                   invoices.length > 0 &&
//                   selectedInvoices.length === invoices.length
//                 }
//               />
//             </th>
//             <th className="p-2 border-r border-gray-300">Invoice Number</th>
//             <th className="p-2 border-r border-gray-300">Customer Name</th>
//             <th className="p-2 border-r border-gray-300">Invoice Date</th>
//             <th className="p-2 border-r border-gray-300">Grand Total</th>
//             <th className="p-2 border-r border-gray-300">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices.length === 0 && (
//             <tr>
//               <td colSpan={6} className="text-center p-4 text-gray-500">
//                 No invoices found.
//               </td>
//             </tr>
//           )}
//           {invoices.map(inv => (
//             <tr key={inv.id} className="hover:bg-gray-50 border-b border-gray-200">
//               <td className="p-2 border-r border-gray-300 text-center">
//                 <input
//                   type="checkbox"
//                   checked={selectedInvoices.includes(inv.id)}
//                   onChange={e => {
//                     if (e.target.checked) {
//                       onSelect([...selectedInvoices, inv.id]);
//                     } else {
//                       onSelect(selectedInvoices.filter(id => id !== inv.id));
//                     }
//                   }}
//                 />
//               </td>
//               <td className="p-2 border-r border-gray-300">{inv.invoice_number}</td>
//               <td className="p-2 border-r border-gray-300">{getCustomerName(inv.customer_id)}</td>
//               <td className="p-2 border-r border-gray-300">{inv.invoice_date?.slice(0, 10)}</td>
//               <td className="p-2 border-r border-gray-300">
//                 ₹ {(Number(inv.grand_total) || 0).toFixed(2)}
//               </td>
//               <td className="p-2 border-r border-gray-300">
//                 <button
//                   onClick={() => onEdit(inv)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selectedInvoices.length > 0 && (
//         <div className="mt-2 text-right">
//           <button
//             onClick={onDeleteSelected}
//             className="bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Delete Selected ({selectedInvoices.length})
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InvoiceList;

// // import React, { useEffect, useState } from 'react';
// // import { getAllCustomers, getAllVendorProducts } from '../Api/apiServices';

// // const InvoiceForm = ({ invoice, onSave, onClose }) => {
// //   const [customers, setCustomers] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [form, setForm] = useState({
// //     invoice_number: '',
// //     customer_id: '',
// //     invoice_date: '',
// //     items: [],
// //   });
// //   const [newLine, setNewLine] = useState({ product_id: '', quantity: 1 });

// //   useEffect(() => {
// //     (async () => {
// //       const [custRes, prodRes] = await Promise.all([
// //         getAllCustomers(),
// //         getAllVendorProducts(),
// //       ]);
// //       setCustomers(custRes.data?.data || custRes.data);
// //       setProducts(prodRes.data?.data || prodRes.data);
// //     })();

// //     if (invoice) {
// //       setForm({
// //         invoice_number: invoice.invoice_number || '',
// //         customer_id: invoice.customer_id,
// //         invoice_date: invoice.invoice_date.slice(0, 10),
// //         items: invoice.items.map(it => ({
// //           product_id: it.product_id,
// //           productname: it.productname,
// //           quantity: it.quantity,
// //           price: Number(it.price),
// //           cgst: Number(it.cgst),
// //           sgst: Number(it.sgst),
// //           igst: Number(it.igst),
// //           total_amount: Number(it.total_amount),
// //         })),
// //       });
// //     }
// //   }, [invoice]);

// //   const addItem = () => {
// //     const prod = products.find(p => p.id === Number(newLine.product_id));
// //     if (!prod || !newLine.quantity) return;
// //     const qty = Number(newLine.quantity);
// //     const base = qty * Number(prod.price);
// //     const cgst = qty * Number(prod.cgst) / 100 * Number(prod.price);
// //     const sgst = qty * Number(prod.sgst) / 100 * Number(prod.price);
// //     const igst = qty * Number(prod.igst) / 100 * Number(prod.price);
// //     const total = base + cgst + sgst + igst;

// //     setForm(prev => ({
// //       ...prev,
// //       items: [
// //         ...prev.items,
// //         {
// //           product_id: prod.id,
// //           productname: prod.productname,
// //           quantity: qty,
// //           price: Number(prod.price),
// //           cgst: Number((Number(prod.cgst) / 100 * base).toFixed(2)),
// //           sgst: Number((Number(prod.sgst) / 100 * base).toFixed(2)),
// //           igst: Number((Number(prod.igst) / 100 * base).toFixed(2)),
// //           total_amount: Number(total.toFixed(2)),
// //         },
// //       ],
// //     }));
// //     setNewLine({ product_id: '', quantity: 1 });
// //   };

// //   const removeItem = index => {
// //     setForm(prev => ({
// //       ...prev,
// //       items: prev.items.filter((_, i) => i !== index),
// //     }));
// //   };

// //   const grandTotal = form.items.reduce((sum, item) => sum + item.total_amount, 0);

// //   const handleSubmit = e => {
// //     e.preventDefault();
// //     onSave({ ...form, grand_total: Number(grandTotal.toFixed(2)) });
// //   };

// //   return (
// //     <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-40 overflow-auto z-50 p-4 pt-20">
// //       <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
// //         <h3 className="text-xl font-bold mb-4">{invoice ? 'Edit Invoice' : 'Create Invoice'}</h3>
// //         <form onSubmit={handleSubmit} className="space-y-4">

// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <input
// //               type="text"
// //               placeholder="Invoice Number"
// //               value={form.invoice_number}
// //               onChange={e => setForm(prev => ({ ...prev, invoice_number: e.target.value }))}
// //               className="border p-2 rounded"
// //               required
// //             />
// //             <select
// //               value={form.customer_id}
// //               onChange={e => setForm(prev => ({ ...prev, customer_id: Number(e.target.value) }))}
// //               className="border p-2 rounded"
// //               required
// //             >
// //               <option value="">Select Customer</option>
// //               {customers.map(c => (
// //                 <option key={c.id} value={c.id}>{c.customer_name}</option>
// //               ))}
// //             </select>
// //             <input
// //               type="date"
// //               value={form.invoice_date}
// //               onChange={e => setForm(prev => ({ ...prev, invoice_date: e.target.value }))}
// //               className="border p-2 rounded"
// //               required
// //             />
// //           </div>

// //           {/* Add Product */}
// //           <div className="border p-4 rounded space-y-2 text-sm">
// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
// //               <select
// //                 value={newLine.product_id}
// //                 onChange={e => setNewLine(prev => ({ ...prev, product_id: e.target.value }))}
// //                 className="border p-2 rounded"
// //               >
// //                 <option value="">Select Product</option>
// //                 {products.map(p => (
// //                   <option key={p.id} value={p.id}>
// //                     {p.productname} (₹{Number(p.price).toFixed(0)})
// //                   </option>
// //                 ))}
// //               </select>
// //               <input
// //                 type="number"
// //                 min="1" step="1"
// //                 value={newLine.quantity}
// //                 onChange={e => setNewLine(prev => ({ ...prev, quantity: e.target.value }))}
// //                 className="border p-2 rounded"
// //                 placeholder="Qty"
// //               />
// //               <button
// //                 type="button"
// //                 onClick={addItem}
// //                 className="bg-blue-600 text-white rounded px-4 py-2"
// //               >Add</button>
// //             </div>

// //             {form.items.length > 0 && (
// //               <table className="w-full text-sm mt-2">
// //                 <thead>
// //                   <tr className="bg-gray-100">
// //                     <th className="border p-1">Product</th>
// //                     <th className="border p-1 text-right">Qty</th>
// //                     <th className="border p-1 text-right">Price</th>
// //                     <th className="border p-1 text-right">CGST</th>
// //                     <th className="border p-1 text-right">SGST</th>
// //                     <th className="border p-1 text-right">IGST</th>
// //                     <th className="border p-1 text-right">Total</th>
// //                     <th className="border p-1 text-center">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {form.items.map((it, i) => (
// //                     <tr key={i} className="hover:bg-gray-50">
// //                       <td className="border p-1">{it.productname}</td>
// //                       <td className="border p-1 text-right">{it.quantity}</td>
// //                       <td className="border p-1 text-right">₹{it.price.toFixed(2)}</td>
// //                       <td className="border p-1 text-right">₹{it.cgst.toFixed(2)}</td>
// //                       <td className="border p-1 text-right">₹{it.sgst.toFixed(2)}</td>
// //                       <td className="border p-1 text-right">₹{it.igst.toFixed(2)}</td>
// //                       <td className="border p-1 text-right">₹{it.total_amount.toFixed(2)}</td>
// //                       <td className="border p-1 text-center">
// //                         {form.items.length > 1 && (
// //                           <button type="button" onClick={() => removeItem(i)} className="text-red-600">
// //                             ×
// //                           </button>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>

// //           <div className="text-right text-lg font-bold">
// //             Grand Total: ₹{grandTotal.toFixed(2)}
// //           </div>

// //           <div className="flex justify-end gap-2">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="bg-gray-300 px-4 py-2 rounded"
// //             >Cancel</button>
// //             <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
// //               {invoice ? 'Update Invoice' : 'Create Invoice'}
// //             </button>
// //           </div>

// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvoiceForm;


// import React, { useEffect, useState } from 'react';
// import { getAllCustomers, getAllVendorProducts } from '../Api/apiServices';

// const InvoiceForm = ({ invoice, onSave, onClose }) => {
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     invoice_number: '',
//     customer_id: '',
//     invoice_date: '',
//     items: [],
//   });

//   const [newLine, setNewLine] = useState({
//     product_id: '',
//     quantity: 1,
//     price: '',
//     discount: 0,
//     cgst: '',
//     sgst: '',
//     igst: '',
//   });

//   // Error states for form-level and line-item-level errors
//   const [formError, setFormError] = useState('');
//   const [lineError, setLineError] = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         const [custRes, prodRes] = await Promise.all([
//           getAllCustomers(),
//           getAllVendorProducts(),
//         ]);
//         setCustomers(custRes.data?.data || custRes.data);
//         setProducts(prodRes.data?.data || prodRes.data);
//       } catch (error) {
//         console.error('Failed to load customers or products', error);
//         setFormError('Failed to load customers or products');
//       }
//     })();

//     if (invoice) {
//       setForm({
//         invoice_number: invoice.invoice_number || '',
//         customer_id: invoice.customer_id,
//         invoice_date: invoice.invoice_date.slice(0, 10),
//         items: invoice.items.map(it => ({
//           product_id: it.product_id,
//           productname: it.productname,
//           quantity: it.quantity,
//           price: Number(it.price),
//           discount: Number(it.discount || 0),
//           cgst: Number(it.cgst),
//           sgst: Number(it.sgst),
//           igst: Number(it.igst),
//           total_amount: Number(it.total_amount),
//         })),
//       });
//     }
//   }, [invoice]);

//   const addItem = () => {
//     setLineError(''); // Clear previous line errors

//     // Validation checks
//     if (!newLine.product_id) {
//       setLineError('Please select a product.');
//       return;
//     }
//     if (!newLine.quantity || Number(newLine.quantity) <= 0) {
//       setLineError('Quantity must be greater than zero.');
//       return;
//     }
//     if (!newLine.price || Number(newLine.price) <= 0) {
//       setLineError('Price must be greater than zero.');
//       return;
//     }

//     const prod = products.find(p => p.id === Number(newLine.product_id));
//     if (!prod) {
//       setLineError('Selected product not found.');
//       return;
//     }

//     const qty = Number(newLine.quantity);
//     const price = Number(newLine.price);
//     const discount = Number(newLine.discount || 0);

//     const base = qty * price;
//     const discountAmount = (discount / 100) * base;
//     const taxableAmount = base - discountAmount;
//     const cgst = (taxableAmount * Number(newLine.cgst || 0)) / 100;
//     const sgst = (taxableAmount * Number(newLine.sgst || 0)) / 100;
//     const igst = (taxableAmount * Number(newLine.igst || 0)) / 100;
//     const total = taxableAmount + cgst + sgst + igst;

//     console.log('Adding item:', {
//       product_id: prod.id,
//       productname: prod.productname,
//       quantity: qty,
//       price,
//       discount,
//       cgst: Number(cgst.toFixed(2)),
//       sgst: Number(sgst.toFixed(2)),
//       igst: Number(igst.toFixed(2)),
//       total_amount: Number(total.toFixed(2)),
//     });

//     setForm(prev => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         {
//           product_id: prod.id,
//           productname: prod.productname,
//           quantity: qty,
//           price,
//           discount,
//           cgst: Number(cgst.toFixed(2)),
//           sgst: Number(sgst.toFixed(2)),
//           igst: Number(igst.toFixed(2)),
//           total_amount: Number(total.toFixed(2)),
//         },
//       ],
//     }));

//     setNewLine({
//       product_id: '',
//       quantity: 1,
//       price: '',
//       discount: 0,
//       cgst: '',
//       sgst: '',
//       igst: '',
//     });
//   };

//   const removeItem = index => {
//     console.log('Removing item at index:', index);
//     setForm(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   const grandTotal = form.items.reduce((sum, item) => sum + item.total_amount, 0);

//   const handleSubmit = e => {
//     e.preventDefault();
//     setFormError(''); // Clear any previous form errors

//     // Validation before submitting
//     if (!form.invoice_number.trim()) {
//       setFormError('Invoice Number is required.');
//       return;
//     }
//     if (!form.customer_id) {
//       setFormError('Please select a customer.');
//       return;
//     }
//     if (!form.invoice_date) {
//       setFormError('Invoice date is required.');
//       return;
//     }
//     if (form.items.length === 0) {
//       setFormError('Add at least one item before saving the invoice.');
//       return;
//     }

//     console.log('Submitting invoice:', { ...form, grand_total: Number(grandTotal.toFixed(2)) });

//     onSave({ ...form, grand_total: Number(grandTotal.toFixed(2)) });
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-start bg-black bg-opacity-40 overflow-auto z-50 p-4 pt-20">
//       <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
//         <h3 className="text-xl font-bold mb-4">{invoice ? 'Edit Invoice' : 'Create Invoice'}</h3>

//         {formError && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//             {formError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Invoice Number"
//               value={form.invoice_number}
//               onChange={e => setForm(prev => ({ ...prev, invoice_number: e.target.value }))}
//               className="border p-2 rounded"
//               required
//             />
//             <select
//               value={form.customer_id}
//               onChange={e => setForm(prev => ({ ...prev, customer_id: Number(e.target.value) }))}
//               className="border p-2 rounded"
//               required
//             >
//               <option value="">Select Customer</option>
//               {customers.map(c => (
//                 <option key={c.id} value={c.id}>
//                   {c.customer_name}
//                 </option>
//               ))}
//             </select>
//             <input
//               type="date"
//               value={form.invoice_date}
//               onChange={e => setForm(prev => ({ ...prev, invoice_date: e.target.value }))}
//               className="border p-2 rounded"
//               required
//             />
//           </div>

//           {/* Product Inputs */}
//           <div className="border p-4 rounded space-y-2 text-sm">
//             <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 items-center">
//               <select
//                 value={newLine.product_id}
//                 onChange={e => setNewLine(prev => ({ ...prev, product_id: e.target.value }))}
//                 className="border p-2 rounded"
//               >
//                 <option value="">Select Product</option>
//                 {products.map(p => (
//                   <option key={p.id} value={p.id}>
//                     {p.productname}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 min="1"
//                 value={newLine.quantity}
//                 onChange={e => setNewLine(prev => ({ ...prev, quantity: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="Qty"
//               />
//               <input
//                 type="number"
//                 min="0"
//                 value={newLine.price}
//                 onChange={e => setNewLine(prev => ({ ...prev, price: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="Price"
//               />
//               <input
//                 type="number"
//                 min="0"
//                 value={newLine.discount}
//                 onChange={e => setNewLine(prev => ({ ...prev, discount: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="Discount %"
//               />
//               <input
//                 type="number"
//                 min="0"
//                 value={newLine.cgst}
//                 onChange={e => setNewLine(prev => ({ ...prev, cgst: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="CGST %"
//               />
//               <input
//                 type="number"
//                 min="0"
//                 value={newLine.sgst}
//                 onChange={e => setNewLine(prev => ({ ...prev, sgst: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="SGST %"
//               />
//               <input
//                 type="number"
//                 min="0"
//                 value={newLine.igst}
//                 onChange={e => setNewLine(prev => ({ ...prev, igst: e.target.value }))}
//                 className="border p-2 rounded"
//                 placeholder="IGST %"
//               />
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className="bg-blue-600 text-white rounded px-4 py-2"
//               >
//                 Add
//               </button>
//             </div>

//             {lineError && (
//               <div className="text-red-600 text-sm mt-1 font-semibold">{lineError}</div>
//             )}

//             {/* Items Table */}
//             {form.items.length > 0 && (
//               <table className="w-full text-sm mt-2 border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border p-1">Product</th>
//                     <th className="border p-1 text-right">Qty</th>
//                     <th className="border p-1 text-right">Price</th>
//                     <th className="border p-1 text-right">Discount %</th>
//                     <th className="border p-1 text-right">CGST</th>
//                     <th className="border p-1 text-right">SGST</th>
//                     <th className="border p-1 text-right">IGST</th>
//                     <th className="border p-1 text-right">Total</th>
//                     <th className="border p-1 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {form.items.map((it, i) => (
//                     <tr key={i} className="hover:bg-gray-50">
//                       <td className="border p-1">{it.productname}</td>
//                       <td className="border p-1 text-right">{it.quantity}</td>
//                       <td className="border p-1 text-right">₹{it.price.toFixed(2)}</td>
//                       <td className="border p-1 text-right">{it.discount}%</td>
//                       <td className="border p-1 text-right">₹{it.cgst.toFixed(2)}</td>
//                       <td className="border p-1 text-right">₹{it.sgst.toFixed(2)}</td>
//                       <td className="border p-1 text-right">₹{it.igst.toFixed(2)}</td>
//                       <td className="border p-1 text-right">₹{it.total_amount.toFixed(2)}</td>
//                       <td className="border p-1 text-center">
//                         {form.items.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(i)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Remove Item"
//                           >
//                             ✕
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           <div className="text-right font-semibold text-lg mt-2">
//             Grand Total: ₹{grandTotal.toFixed(2)}
//           </div>

//           <div className="flex justify-end space-x-4 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
//             >
//               {invoice ? 'Update Invoice' : 'Create Invoice'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InvoiceForm;


// import React, { useEffect, useState } from 'react';
// import {
//   getAllCompanies,
//   getAllVendorProducts,
//   createInvoice,
//   updateInvoiceById
// } from '../Api/apiServices'; // your API file

// function InvoiceForm({ invoice, onClose, onSave }) {
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     customer_id: '',
//     invoice_date: '',
//     items: []
//   });

//   useEffect(() => {
//     loadCustomers();
//     loadProducts();
//     if (invoice) prefillForm(invoice);
//   }, [invoice]);

//   const loadCustomers = async () => {
//     const res = await getAllCompanies();
//     setCustomers(res.data);
//   };

//   const loadProducts = async () => {
//     const res = await getAllVendorProducts();
//     setProducts(res.data);
//   };

//   const prefillForm = (inv) => {
//     setForm({
//       customer_id: inv.customer_id,
//       invoice_date: inv.invoice_date.slice(0, 10),
//       items: inv.items.map(i => ({
//         product_id: i.product_id,
//         quantity: i.quantity,
//         price: i.price,
//         discount: i.discount || 0,
//         cgst: i.cgst || 0,
//         sgst: i.sgst || 0,
//         igst: i.igst || 0
//       }))
//     });
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...form.items];
//     updatedItems[index][field] = value;
//     setForm({ ...form, items: updatedItems });
//   };

//   const addItem = () => {
//     setForm({
//       ...form,
//       items: [...form.items, { product_id: '', quantity: 1, price: 0, discount: 0, cgst: 0, sgst: 0, igst: 0 }]
//     });
//   };

//   const removeItem = (index) => {
//     const updatedItems = [...form.items];
//     updatedItems.splice(index, 1);
//     setForm({ ...form, items: updatedItems });
//   };

//   const calculateTotal = () => {
//     return form.items.reduce((total, item) => {
//       const amount = (item.price * item.quantity) - item.discount;
//       const tax = amount * ((+item.cgst + +item.sgst + +item.igst) / 100);
//       return total + amount + tax;
//     }, 0);
//   };

//   const handleSubmit = async () => {
//     const total_amount = calculateTotal();
//     const payload = { ...form, total_amount };

//     if (invoice) {
//       await updateInvoiceById(invoice.id, payload);
//     } else {
//       await createInvoice(payload);
//     }

//     onSave(); // refresh invoice list
//   };

//   return (
//     <div style={{ border: '1px solid #aaa', padding: 20, backgroundColor: '#f9f9f9' }}>
//       <h3>{invoice ? 'Update' : 'Create'} Invoice</h3>

//       <div>
//         <label>Customer:</label>
//         <select
//           value={form.customer_id}
//           onChange={e => setForm({ ...form, customer_id: e.target.value })}
//         >
//           <option value="">Select Customer</option>
//           {customers.map(c => (
//             <option key={c.id} value={c.id}>{c.customer_name}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Invoice Date:</label>
//         <input
//           type="date"
//           value={form.invoice_date}
//           onChange={e => setForm({ ...form, invoice_date: e.target.value })}
//         />
//       </div>

//       <h4>Items</h4>
//       {form.items.map((item, idx) => (
//         <div key={idx} style={{ marginBottom: 10, padding: 10, border: '1px dashed gray' }}>
//           <select
//             value={item.product_id}
//             onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
//           >
//             <option value="">Select Product</option>
//             {products.map(p => (
//               <option key={p.id} value={p.id}>{p.productname}</option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Quantity"
//             value={item.quantity}
//             onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
//             style={{ width: 60, marginLeft: 5 }}
//           />

//           <input
//             type="number"
//             placeholder="Price"
//             value={item.price}
//             onChange={e => handleItemChange(idx, 'price', e.target.value)}
//             style={{ width: 80, marginLeft: 5 }}
//           />

//           <input
//             type="number"
//             placeholder="Discount"
//             value={item.discount}
//             onChange={e => handleItemChange(idx, 'discount', e.target.value)}
//             style={{ width: 80, marginLeft: 5 }}
//           />

//           <input
//             type="number"
//             placeholder="CGST"
//             value={item.cgst}
//             onChange={e => handleItemChange(idx, 'cgst', e.target.value)}
//             style={{ width: 60, marginLeft: 5 }}
//           />

//           <input
//             type="number"
//             placeholder="SGST"
//             value={item.sgst}
//             onChange={e => handleItemChange(idx, 'sgst', e.target.value)}
//             style={{ width: 60, marginLeft: 5 }}
//           />

//           <input
//             type="number"
//             placeholder="IGST"
//             value={item.igst}
//             onChange={e => handleItemChange(idx, 'igst', e.target.value)}
//             style={{ width: 60, marginLeft: 5 }}
//           />

//           <button onClick={() => removeItem(idx)} style={{ marginLeft: 10 }}>X</button>
//         </div>
//       ))}

//       <button onClick={addItem}>+ Add Item</button>

//       <div style={{ marginTop: 20 }}>
//         <strong>Total Amount:</strong> ₹ {calculateTotal().toFixed(2)}
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <button onClick={handleSubmit}>
//           {invoice ? 'Update' : 'Create'}
//         </button>
//         <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
//       </div>
//     </div>
//   );
// }

// export default InvoiceForm;




// import React, { useEffect, useState } from 'react';
// import {
//     getAllCustomers,
//   getAllVendorProducts,
//   createInvoice,
//   updateInvoiceById
// } from '../Api/apiServices';

// function InvoiceForm({ invoice, onClose, onSave }) {
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     customer_id: '',
//     invoice_date: '',
//     items: []
//   });

//   useEffect(() => {
//     loadCustomers();
//     loadProducts();
//     if (invoice) prefillForm(invoice);
//   }, [invoice]);

//   const loadCustomers = async () => {
//     const res = await getAllCompanies();
//     setCustomers(res.data);
//   };

//   const loadProducts = async () => {
//     const res = await getAllVendorProducts();
//     setProducts(res.data);
//   };

//   const prefillForm = (inv) => {
//     setForm({
//       customer_id: inv.customer_id,
//       invoice_date: inv.invoice_date.slice(0, 10),
//       items: inv.items.map(i => ({
//         product_id: i.product_id,
//         quantity: i.quantity,
//         price: i.price,
//         discount: i.discount || 0,
//         cgst: i.cgst || 0,
//         sgst: i.sgst || 0,
//         igst: i.igst || 0
//       }))
//     });
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...form.items];
//     updatedItems[index][field] = value;
//     setForm({ ...form, items: updatedItems });
//   };

//   const addItem = () => {
//     setForm({
//       ...form,
//       items: [...form.items, { product_id: '', quantity: 1, price: 0, discount: 0, cgst: 0, sgst: 0, igst: 0 }]
//     });
//   };

//   const removeItem = (index) => {
//     const updatedItems = [...form.items];
//     updatedItems.splice(index, 1);
//     setForm({ ...form, items: updatedItems });
//   };

//   const calculateTotal = () => {
//     return form.items.reduce((total, item) => {
//       const amount = (item.price * item.quantity) - item.discount;
//       const tax = amount * ((+item.cgst + +item.sgst + +item.igst) / 100);
//       return total + amount + tax;
//     }, 0);
//   };

//   const handleSubmit = async () => {
//     const total_amount = calculateTotal();
//     const payload = { ...form, total_amount };

//     if (invoice) {
//       await updateInvoiceById(invoice.id, payload);
//     } else {
//       await createInvoice(payload);
//     }

//     onSave(); // refresh list
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//       <h2 className="text-lg font-semibold mb-4">{invoice ? 'Update' : 'Create'} Invoice</h2>

//       {/* Customer & Date */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block font-medium mb-1">Customer</label>
//           <select
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             value={form.customer_id}
//             onChange={e => setForm({ ...form, customer_id: e.target.value })}
//           >
//             <option value="">Select Customer</option>
//             {customers.map(c => (
//               <option key={c.id} value={c.id}>{c.customer_name}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Invoice Date</label>
//           <input
//             type="date"
//             className="w-full border border-gray-300 rounded px-3 py-2"
//             value={form.invoice_date}
//             onChange={e => setForm({ ...form, invoice_date: e.target.value })}
//           />
//         </div>
//       </div>

//       {/* Items */}
//       <h4 className="text-md font-semibold mb-2">Items</h4>
//       <div className="space-y-4 mb-4">
//         {form.items.map((item, idx) => (
//           <div
//             key={idx}
//             className="border border-gray-300 rounded-md p-4 flex flex-col md:flex-row md:items-center gap-3"
//           >
//             <select
//               className="flex-1 border border-gray-300 rounded px-2 py-1"
//               value={item.product_id}
//               onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
//             >
//               <option value="">Select Product</option>
//               {products.map(p => (
//                 <option key={p.id} value={p.id}>{p.productname}</option>
//               ))}
//             </select>

//             <input
//               type="number"
//               placeholder="Qty"
//               className="w-20 border border-gray-300 rounded px-2 py-1"
//               value={item.quantity}
//               onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               className="w-24 border border-gray-300 rounded px-2 py-1"
//               value={item.price}
//               onChange={e => handleItemChange(idx, 'price', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Discount"
//               className="w-24 border border-gray-300 rounded px-2 py-1"
//               value={item.discount}
//               onChange={e => handleItemChange(idx, 'discount', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="CGST"
//               className="w-20 border border-gray-300 rounded px-2 py-1"
//               value={item.cgst}
//               onChange={e => handleItemChange(idx, 'cgst', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="SGST"
//               className="w-20 border border-gray-300 rounded px-2 py-1"
//               value={item.sgst}
//               onChange={e => handleItemChange(idx, 'sgst', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="IGST"
//               className="w-20 border border-gray-300 rounded px-2 py-1"
//               value={item.igst}
//               onChange={e => handleItemChange(idx, 'igst', e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(idx)}
//               className="text-red-600 font-bold ml-2"
//               title="Remove item"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         type="button"
//         onClick={addItem}
//         className="bg-gray-100 text-gray-700 px-4 py-2 rounded border hover:bg-gray-200"
//       >
//         + Add Item
//       </button>

//       {/* Total */}
//       <div className="mt-6 text-right text-lg font-semibold">
//         Total Amount: ₹ {calculateTotal().toFixed(2)}
//       </div>

//       {/* Actions */}
//       <div className="mt-6 flex gap-4">
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//         >
//           {invoice ? 'Update' : 'Create'}
//         </button>
//         <button
//           onClick={onClose}
//           className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InvoiceForm;



import React, { useEffect, useState } from 'react';
import {
  getAllCustomers,
  getAllVendorProducts,
  createInvoice,
  updateInvoiceById,
} from '../Api/apiServices';

function InvoiceForm({ invoice, onClose, onSave }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_id: '',
    invoice_date: '',
    items: [],
  });

  useEffect(() => {
    loadCustomers();
    loadProducts();
    if (invoice) prefillForm(invoice);
  }, [invoice]);

  const loadCustomers = async () => {
    try {
      const res = await getAllCustomers();
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers", err);
      setCustomers([]);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getAllVendorProducts();
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Error loading products", err);
      setProducts([]);
    }
  };

  const prefillForm = (inv) => {
    setForm({
      customer_id: inv.customer_id,
      invoice_date: inv.invoice_date.slice(0, 10),
      items: inv.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.price,
        discount: i.discount || 0,
        cgst: i.cgst || 0,
        sgst: i.sgst || 0,
        igst: i.igst || 0,
      })),
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product_id: '',
          quantity: 1,
          price: 0,
          discount: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm({ ...form, items: updatedItems });
  };

  const calculateTotal = () => {
    return form.items.reduce((total, item) => {
      const amount = item.price * item.quantity - item.discount;
      const tax = amount * ((+item.cgst + +item.sgst + +item.igst) / 100);
      return total + amount + tax;
    }, 0);
  };

  const handleSubmit = async () => {
    const total_amount = calculateTotal();
    const payload = { ...form, total_amount };

    if (invoice) {
      await updateInvoiceById(invoice.id, payload);
    } else {
      await createInvoice(payload);
    }

    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">
        {invoice ? 'Update Invoice' : 'Create Invoice'}
      </h2>

      {/* Customer & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          >
            <option value="">Select Customer</option>
            {Array.isArray(customers) &&
              customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.invoice_date}
            onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
          />
        </div>
      </div>

      {/* Invoice Items */}
      <h4 className="text-md font-semibold mb-3">Invoice Items</h4>
      <div className="space-y-6 mb-6">
        {form.items.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-md p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.product_id}
                onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
              >
                <option value="">Select Product</option>
                {Array.isArray(products) &&
                  products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productname}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.price}
                onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.discount}
                onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CGST (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.cgst}
                onChange={(e) => handleItemChange(idx, 'cgst', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SGST (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.sgst}
                onChange={(e) => handleItemChange(idx, 'sgst', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">IGST (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={item.igst}
                onChange={(e) => handleItemChange(idx, 'igst', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-red-600 font-bold"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="bg-blue-100 text-blue-800 px-4 py-2 rounded border border-blue-200 hover:bg-blue-200 mb-4"
      >
        + Add New Item
      </button>

      {/* Total */}
      <div className="text-right text-lg font-semibold mb-6">
        Total Amount: ₹ {calculateTotal().toFixed(2)}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;

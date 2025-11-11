// import React, { useEffect, useState } from 'react';
// import InvoiceList from '../components/InvoiceList';
// import InvoiceForm from '../components/InvoiceForm';
// import {
//   getAllInvoices,
//   addInvoice,
//   deleteInvoiceById,
// } from '../Api/apiServices';

// const InvoicePage = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editInvoice, setEditInvoice] = useState(null);
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [error, setError] = useState('');

//   const fetchInvoices = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await getAllInvoices();
//       // Assuming data is in res.data or res.data.data
//       const data = res.data?.data || res.data || [];
//       setInvoices(data);
//     } catch (err) {
//       setError('Failed to fetch invoices.');
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const handleAddClick = () => {
//     setEditInvoice(null);
//     setShowForm(true);
//   };

//   const handleSave = async invoiceData => {
//     setLoading(true);
//     setError('');
//     try {
//       if (editInvoice) {
//         // Update
//         await updateInvoice(editInvoice.id, invoiceData);
//       } else {
//         // Add
//         await addInvoice(invoiceData);
//       }
//       await fetchInvoices();
//       setShowForm(false);
//       setEditInvoice(null);
//       setSelectedInvoices([]);
//     } catch (err) {
//       setError('Failed to save invoice.');
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const handleEdit = invoice => {
//     setEditInvoice(invoice);
//     setShowForm(true);
//   };

//   const handleDeleteSelected = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedInvoices.length} invoice(s)?`
//       )
//     )
//       return;
//     setLoading(true);
//     setError('');
//     try {
//       await deleteInvoices(selectedInvoices);
//       await fetchInvoices();
//       setSelectedInvoices([]);
//     } catch (err) {
//       setError('Failed to delete invoices.');
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>

//       {error && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//           {error}
//         </div>
//       )}

//       <div className="mb-4 flex justify-between items-center">
//         <button
//           onClick={handleAddClick}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           + Add Invoice
//         </button>
//       </div>

//       {loading && (
//         <div className="mb-4 text-center text-gray-600">Loading...</div>
//       )}

//       <InvoiceList
//         invoices={invoices}
//         onEdit={handleEdit}
//         onSelect={setSelectedInvoices}
//         selectedInvoices={selectedInvoices}
//         onDeleteSelected={handleDeleteSelected}
//       />

//       {showForm && (
//         <InvoiceForm
//           invoice={editInvoice}
//           onSave={handleSave}
//           onClose={() => {
//             setShowForm(false);
//             setEditInvoice(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default InvoicePage;




// import React, { useState, useEffect } from 'react';
// import {
//   getAllInvoices,
//   deleteInvoiceById,
//   getInvoiceById,
// } from '../Api/apiServices'; // your api imports here

// export default function InvoiceManager() {
//   const [invoices, setInvoices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all invoices
//   const fetchInvoices = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllInvoices();
//       setInvoices(response.data);
//     } catch (err) {
//       alert('Failed to fetch invoices');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // Filter invoices by search term (customer name, invoice id, etc)
//   const filteredInvoices = invoices.filter(inv =>
//     inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     String(inv.id).includes(searchTerm)
//   );

//   // Delete invoice
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure to delete this invoice?')) return;
//     try {
//       await deleteInvoiceById(id);
//       alert('Invoice deleted');
//       fetchInvoices();
//     } catch {
//       alert('Delete failed');
//     }
//   };

//   // View invoice details
//   const handleViewInvoice = async (id) => {
//     try {
//       const res = await getInvoiceById(id);
//       setSelectedInvoice(res.data);
//     } catch {
//       alert('Failed to load invoice');
//     }
//   };

//   // Print invoice
//   const handlePrint = () => {
//     if (!selectedInvoice) return;
//     // Simple print using window.print with a popup window or dedicated print section
//     const printContent = document.getElementById('print-area').innerHTML;
//     const win = window.open('', '', 'width=800,height=600');
//     win.document.write('<html><head><title>Invoice Print</title></head><body>');
//     win.document.write(printContent);
//     win.document.write('</body></html>');
//     win.document.close();
//     win.print();
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: 'Arial' }}>
//       <h2>Invoice Manager</h2>

//       {/* Top Bar */}
//       <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
//         <input
//           type="text"
//           placeholder="Search invoices..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           style={{ padding: 8, flex: 1 }}
//         />

//         <button
//           onClick={() => alert('Navigate to Create Invoice page or open modal')}
//           style={{ padding: '8px 12px' }}
//         >
//           Create Invoice
//         </button>
//       </div>

//       {/* Invoice List */}
//       {loading ? (
//         <p>Loading invoices...</p>
//       ) : (
//         <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead style={{ backgroundColor: '#eee' }}>
//             <tr>
//               <th>ID</th>
//               <th>Customer Name</th>
//               <th>Invoice Date</th>
//               <th>Grand Total</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredInvoices.length === 0 && (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: 'center' }}>No invoices found</td>
//               </tr>
//             )}
//             {filteredInvoices.map(inv => (
//               <tr key={inv.id}>
//                 <td>{inv.id}</td>
//                 <td>{inv.customer_name}</td>
//                 <td>{new Date(inv.invoice_date).toLocaleDateString()}</td>
//                 <td>{inv.grand_total}</td>
//                 <td>
//                   <button onClick={() => handleViewInvoice(inv.id)}>View</button>{' '}
//                   <button onClick={() => alert('Navigate to Update Invoice page or open modal')}>Update</button>{' '}
//                   <button onClick={() => handleDelete(inv.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Invoice Details Modal */}
//       {selectedInvoice && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex', justifyContent: 'center', alignItems: 'center',
//             zIndex: 9999,
//           }}
//           onClick={() => setSelectedInvoice(null)} // Close modal on background click
//         >
//           <div
//             style={{ backgroundColor: 'white', padding: 20, maxWidth: 800, width: '90%', position: 'relative' }}
//             onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
//           >
//             <h3>Invoice #{selectedInvoice.id}</h3>

//             <div id="print-area" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
//               <p><b>Customer:</b> {selectedInvoice.customer_name || selectedInvoice.customer_id}</p>
//               <p><b>Invoice Date:</b> {new Date(selectedInvoice.invoice_date).toLocaleDateString()}</p>
//               <p><b>Bill To:</b> {selectedInvoice.bill_to_address}</p>
//               <p><b>Ship To:</b> {selectedInvoice.ship_to_address}</p>

//               <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 <thead style={{ backgroundColor: '#ddd' }}>
//                   <tr>
//                     <th>Product ID</th>
//                     <th>Serial Number</th>
//                     <th>Quantity</th>
//                     <th>Rate</th>
//                     <th>Discount</th>
//                     <th>CGST</th>
//                     <th>SGST</th>
//                     <th>IGST</th>
//                     <th>Total Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedInvoice.items?.map(item => (
//                     <tr key={item.id}>
//                       <td>{item.product_id}</td>
//                       <td>{item.serial_number}</td>
//                       <td>{item.quantity}</td>
//                       <td>{item.rate}</td>
//                       <td>{item.discount}</td>
//                       <td>{item.cgst}</td>
//                       <td>{item.sgst}</td>
//                       <td>{item.igst}</td>
//                       <td>{item.total_amount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <h4>Totals</h4>
//               <p><b>Total Amount:</b> {selectedInvoice.total_amount}</p>
//               <p><b>Total Discount:</b> {selectedInvoice.total_discount}</p>
//               <p><b>Total CGST:</b> {selectedInvoice.total_cgst}</p>
//               <p><b>Total SGST:</b> {selectedInvoice.total_sgst}</p>
//               <p><b>Total IGST:</b> {selectedInvoice.total_igst}</p>
//               <p><b>Grand Total:</b> {selectedInvoice.grand_total}</p>
//             </div>

//             <div style={{ marginTop: 15, textAlign: 'right' }}>
//               <button onClick={() => setSelectedInvoice(null)} style={{ marginRight: 10 }}>Close</button>
//               <button onClick={handlePrint}>Print</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import {
//   createInvoice,
//   getAllInvoices,
//   getAllCompanies,
//   getAllCustomers,
//   getAllProducts
// } from '../Api/apiServices';

// const InvoicePage = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [form, setForm] = useState({
//     company_id: '',
//     customer_id: '',
//     invoice_date: '',
//     items: [],
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = () => {
//     getAllInvoices().then((res) => setInvoices(res.data.data || []));
//     getAllProducts().then((res) => setProducts(res.data.data || []));
//     getAllCompanies().then((res) => setCompanies(res.data.data || []));
//     getAllCustomers().then((res) => setCustomers(res.data.data || []));
//   };

//   const addItem = () => {
//     setForm({
//       ...form,
//       items: [...form.items, { product_id: '', quantity: 1 }],
//     });
//   };

//   const updateItem = (index, field, value) => {
//     const items = [...form.items];
//     items[index][field] = field === 'quantity' ? Number(value) : value;
//     setForm({ ...form, items });
//   };

//   const removeItem = (index) => {
//     const items = [...form.items];
//     items.splice(index, 1);
//     setForm({ ...form, items });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.company_id || !form.customer_id || !form.invoice_date || form.items.length === 0) {
//       alert('Please fill all fields');
//       return;
//     }
//     createInvoice({
//       company_id: form.company_id,
//       customer_id: form.customer_id,
//       invoice_date: form.invoice_date,
//       products: form.items,
//     }).then(() => {
//       alert('Invoice created!');
//       setForm({ company_id: '', customer_id: '', invoice_date: '', items: [] });
//       loadData();
//     });
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Create Invoice</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Company:</label>
//           <select value={form.company_id} onChange={(e) => setForm({ ...form, company_id: e.target.value })}>
//             <option value="">Select</option>
//             {companies.map((c) => (
//               <option key={c.id} value={c.id}>{c.company_name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Customer:</label>
//           <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
//             <option value="">Select</option>
//             {customers.map((c) => (
//               <option key={c.id} value={c.id}>{c.customer_name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Invoice Date:</label>
//           <input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} />
//         </div>

//         <h4>Invoice Items:</h4>
//         {form.items.map((item, index) => (
//           <div key={index}>
//             <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)}>
//               <option value="">Select Product</option>
//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>{p.productname}</option>
//               ))}
//             </select>
//             <input
//               type="number"
//               min="1"
//               value={item.quantity}
//               onChange={(e) => updateItem(index, 'quantity', e.target.value)}
//             />
//             <button type="button" onClick={() => removeItem(index)}>Remove</button>
//           </div>
//         ))}
//         <button type="button" onClick={addItem}>+ Add Product</button>

//         <br /><br />
//         <button type="submit">Submit Invoice</button>
//       </form>

//       <hr />

//       <h2>All Invoices</h2>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Company</th>
//             <th>Customer</th>
//             <th>Date</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices.map((inv) => (
//             <tr key={inv.id}>
//               <td>{inv.id}</td>
//               <td>{inv.company_id}</td>
//               <td>{inv.customer_id}</td>
//               <td>{inv.invoice_date}</td>
//               <td>{inv.grand_total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InvoicePage;



// import React, { useState, useEffect } from 'react';
// import { getAllInvoices, getAllCompanies, getAllVendorProducts,
//    createInvoice, updateInvoiceById, deleteInvoiceById } from '../Api/apiServices'; // your api file

// function InvoiceManager() {
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [showInvoiceForm, setShowInvoiceForm] = useState(false);

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   const loadInvoices = async () => {
//     const res = await getAllInvoices();
//     setInvoices(res.data);
//     setFilteredInvoices(res.data);
//   };

//   const onSearchChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);
//     if (!val) {
//       setFilteredInvoices(invoices);
//     } else {
//       const filtered = invoices.filter(inv => 
//         inv.customer_name.toLowerCase().includes(val.toLowerCase()) ||
//         inv.id.toString().includes(val)
//       );
//       setFilteredInvoices(filtered);
//     }
//   };

//   const onSelectInvoice = (invoice) => {
//     setSelectedInvoice(invoice);
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//         <input 
//           type="text" 
//           placeholder="Search invoices..." 
//           value={searchTerm} 
//           onChange={onSearchChange} 
//         />
//         <button onClick={() => { setSelectedInvoice(null); setShowInvoiceForm(true); }}>
//           Create Invoice
//         </button>
//         <button 
//           disabled={!selectedInvoice} 
//           onClick={() => setShowInvoiceForm(true)}
//         >
//           Update Invoice
//         </button>
//         <button 
//           disabled={!selectedInvoice} 
//           onClick={async () => {
//             if(selectedInvoice && window.confirm('Are you sure?')) {
//               await deleteInvoiceById(selectedInvoice.id);
//               await loadInvoices();
//               setSelectedInvoice(null);
//             }
//           }}
//         >
//           Delete Invoice
//         </button>
//       </div>

//       <table border="1" width="100%">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Customer</th>
//             <th>Date</th>
//             <th>Total Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredInvoices.map(inv => (
//             <tr 
//               key={inv.id} 
//               onClick={() => onSelectInvoice(inv)} 
//               style={{ backgroundColor: selectedInvoice?.id === inv.id ? '#ddd' : 'transparent', cursor: 'pointer' }}
//             >
//               <td>{inv.id}</td>
//               <td>{inv.customer_name}</td>
//               <td>{inv.invoice_date}</td>
//               <td>{inv.total_amount}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showInvoiceForm && (
//         <InvoiceForm 
//           invoice={selectedInvoice} 
//           onClose={() => setShowInvoiceForm(false)} 
//           onSave={async () => {
//             await loadInvoices();
//             setShowInvoiceForm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default InvoiceManager;




import React, { useState, useEffect } from 'react';
import {
  getAllInvoices,
  deleteInvoiceById,
} from '../Api/apiServices';
import InvoiceForm from '../components/InvoiceForm'; // assuming this is your form component

function InvoiceManager() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const res = await getAllInvoices();
    setInvoices(res.data);
    setFilteredInvoices(res.data);
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!val) {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter((inv) =>
        inv.customer_name?.toLowerCase().includes(val.toLowerCase()) ||
        inv.id.toString().includes(val)
      );
      setFilteredInvoices(filtered);
    }
  };

  const onSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={onSearchChange}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => {
              setSelectedInvoice(null);
              setShowInvoiceForm(true);
            }}
          >
            Create Invoice
          </button>

          <button
            className={`px-4 py-2 rounded ${
              selectedInvoice ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!selectedInvoice}
            onClick={() => setShowInvoiceForm(true)}
          >
            Update Invoice
          </button>


          <button
  className={`px-4 py-2 rounded ${
    selectedInvoice ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
  }`}
  disabled={!selectedInvoice}
  onClick={() => {
    if (selectedInvoice) {
      window.open(`/invoice-print/${selectedInvoice.id}`, '_blank');
    }
  }}
>
  Print / Download
</button>

          <button
            className={`px-4 py-2 rounded ${
              selectedInvoice ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!selectedInvoice}
            onClick={async () => {
              if (selectedInvoice && window.confirm('Are you sure you want to delete this invoice?')) {
                await deleteInvoiceById(selectedInvoice.id);
                await loadInvoices();
                setSelectedInvoice(null);
              }
            }}
          >
            Delete Invoice
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className={`hover:bg-blue-50 cursor-pointer ${
                  selectedInvoice?.id === inv.id ? 'bg-blue-100' : ''
                }`}
              >
                <td className="px-4 py-2 border-b">{inv.id}</td>
                <td className="px-4 py-2 border-b">{inv.customer_name}</td>
                <td className="px-4 py-2 border-b">{inv.invoice_date}</td>
                <td className="px-4 py-2 border-b">₹ {inv.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal or Section */}
      {showInvoiceForm && (
        <div className="mt-8">
          <InvoiceForm
            invoice={selectedInvoice}
            onClose={() => setShowInvoiceForm(false)}
            onSave={async () => {
              await loadInvoices();
              setShowInvoiceForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default InvoiceManager;

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";

// function InvoicePage({ invoiceId }) {
//   const [company, setCompany] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [invoice, setInvoice] = useState(null);
//   const componentRef = useRef();

//   // Fetch company profile
//   const fetchCompany = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getProfile");
//       setCompany(res.data);
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   // Fetch customers and ensure result is an array
//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllCustomers");
//       console.log("Customer API response:", res.data);

//       const customersArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.customers)
//         ? res.data.customers
//         : [];
//       setCustomers(customersArray);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   // Fetch vendor products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllVendorProducts");
//       const productsArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.products)
//         ? res.data.products
//         : [];
//       setProducts(productsArray);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Fetch invoice by ID
//   const fetchInvoice = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllInvoices");
//       const inv = Array.isArray(res.data) ? res.data.find((inv) => inv.id === invoiceId) : null;
//       setInvoice(inv);
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCompany();
//     fetchCustomers();
//     fetchProducts();
//     fetchInvoice();
//   }, [invoiceId]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   if (!company || !invoice) return <div>Loading...</div>;

//   const customer = Array.isArray(customers)
//     ? customers.find((c) => c.id === invoice.customer_id)
//     : null;

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <div ref={componentRef} style={{ padding: 20, fontFamily: "Arial, sans-serif", fontSize: 12, color: "#000" }}>
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid black", paddingBottom: 10 }}>
//           <div style={{ width: "60%" }}>
//             <h2 style={{ fontWeight: "bold", fontSize: 18 }}>{company.company_name}</h2>
//             <div>{company.address_1}, {company.pin_code_1}</div>
//             <div>{company.state_name_1} - Code: {company.state_gst_code_1}</div>
//             <div>GSTIN/UIN: {company.gst_number}</div>
//             <div>Email: {company.email}</div>
//             <div>Contact: {company.contact_person_1_name} - {company.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "35%", border: "1px solid black", padding: 10, fontWeight: "bold", fontSize: 14 }}>
//             <div>Invoice No: {company.invoice_prefix}{invoice.id}</div>
//             <div>Date: {dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}</div>
//             <div>Terms of Payment: 50% on Delivery, 50% 45 Days PDC</div>
//           </div>
//         </div>

//         {/* Ship To / Bill To */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 15, border: "1px solid black", padding: 10 }}>
//           <div style={{ width: "48%" }}>
//             <strong>Consignee (Ship to):</strong><br />
//             <div>{customer?.customer_name}</div>
//             <div>{customer?.address_1}, {customer?.state_name_1}, {customer?.pin_code_1}</div>
//             <div>GSTIN: {customer?.gst_number}</div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "48%" }}>
//             <strong>Buyer (Bill to):</strong><br />
//             <div>{customer?.customer_name}</div>
//             <div>{customer?.address_1}, {customer?.state_name_1}, {customer?.pin_code_1}</div>
//             <div>GSTIN: {customer?.gst_number}</div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
//           <thead>
//             <tr style={{ borderBottom: "2px solid black" }}>
//               <th style={{ border: "1px solid black", padding: 4 }}>Sl. No</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Description of Goods</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>HSN/SAC</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Quantity</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Rate</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Disc. %</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, idx) => {
//               const product = products.find((p) => p.id === item.product_id);
//               const discAmount = item.price * item.quantity * (item.discount / 100);
//               const amount = (item.price * item.quantity) - discAmount;

//               return (
//                 <tr key={idx}>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{idx + 1}</td>
//                   <td style={{ border: "1px solid black", padding: 4 }}>
//                     <div><strong>{product?.productname || item.productname}</strong></div>
//                     <div>Serials: {product?.serial_numbers?.join(", ") || "N/A"}</div>
//                   </td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{product?.hsncode || "N/A"}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{item.quantity}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "right" }}>{Number(item.price).toFixed(2)}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{item.discount}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "right" }}>{amount.toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Total */}
//         <div style={{ marginTop: 15, fontWeight: "bold", textAlign: "right" }}>
//           Total Amount: ₹ {Number(invoice.total_amount).toFixed(2)}
//         </div>

//         {/* GST & Bank Details */}
//         <div style={{ marginTop: 15, borderTop: "1px solid black", paddingTop: 10 }}>
//           <div><strong>GST Number:</strong> {company.gst_number}</div>
//           <div><strong>PAN Number:</strong> {company.pan_number}</div>
//           <div style={{ marginTop: 10 }}>
//             <strong>Bank Details:</strong><br />
//             <div>{company.account_holder_1_name}, {company.bank_name_1}, A/c: {company.account_number_1}, IFSC: {company.ifsc_code_1}</div>
//             <div>{company.account_holder_2_name}, {company.bank_name_2}, A/c: {company.account_number_2}, IFSC: {company.ifsc_code_2}</div>
//           </div>
//           <div style={{ marginTop: 10 }}>
//             <strong>Terms & Conditions:</strong><br />
//             <div>{company.terms_and_conditions}</div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" }}>
//           This is a Computer Generated Invoice
//         </div>
//       </div>

//       {/* Print Button */}
//       <div className="mt-4">
//         <button
//           onClick={handlePrint}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: "#007bff",
//             border: "none",
//             color: "white",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           Download PDF / Print Invoice
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InvoicePage;





// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";

// function InvoicePage({ invoiceId }) {
//   const [company, setCompany] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [invoice, setInvoice] = useState(null);
//   const componentRef = useRef();

//   // Fetch company profile
//   const fetchCompany = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getProfile");
//       setCompany(res.data);
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   // Fetch customers and ensure result is an array
//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllCustomers");
//       const customersArray = Array.isArray(res.data.data) ? res.data.data : [];
//       setCustomers(customersArray);

//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   // Fetch vendor products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllVendorProducts");
//       const productsArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.products)
//           ? res.data.products
//           : [];
//       setProducts(productsArray);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Fetch invoice by ID
//   const fetchInvoice = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllInvoices");
//       const inv = Array.isArray(res.data) ? res.data.find((inv) => inv.id === invoiceId) : null;
//       setInvoice(inv);
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCompany();
//     fetchCustomers();
//     fetchProducts();
//     fetchInvoice();
//   }, [invoiceId]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   if (!company || !invoice) return <div>Loading...</div>;

//   const customer = Array.isArray(customers)
//     ? customers.find((c) => c.id === invoice.customer_id)
//     : null;

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <div ref={componentRef} style={{ padding: 20, fontFamily: "Arial, sans-serif", fontSize: 12, color: "#000" }}>
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid black", paddingBottom: 10 }}>
//           <div style={{ width: "60%" }}>
//             <h2 style={{ fontWeight: "bold", fontSize: 18 }}>{company.company_name}</h2>
//             <div>{company.address_1}, {company.pin_code_1}</div>
//             <div>{company.state_name_1} - Code: {company.state_gst_code_1}</div>
//             <div>GSTIN/UIN: {company.gst_number}</div>
//             <div>Email: {company.email}</div>
//             <div>Contact: {company.contact_person_1_name} - {company.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "35%", border: "1px solid black", padding: 10, fontWeight: "bold", fontSize: 14 }}>
//             <div>Invoice No: {company.invoice_prefix}{invoice.id}</div>
//             <div>Date: {dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}</div>
//             <div>Terms of Payment: 50% on Delivery, 50% 45 Days PDC</div>
//           </div>
//         </div>

//         {/* Ship To / Bill To */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 15, border: "1px solid black", padding: 10 }}>
//           <div style={{ width: "48%" }}>
//             <strong>Consignee (Ship to):</strong><br />
//             <div>{customer?.customer_name}</div>
//             <div>{customer?.address_1}, {customer?.state_name_1}, {customer?.pin_code_1}</div>
//             <div>GSTIN: {customer?.gst_number}</div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "48%" }}>
//             <strong>Buyer (Bill to):</strong><br />
//             <div>{customer?.customer_name}</div>
//             <div>{customer?.address_1}, {customer?.state_name_1}, {customer?.pin_code_1}</div>
//             <div>GSTIN: {customer?.gst_number}</div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 15 }}>
//           <thead>
//             <tr style={{ borderBottom: "2px solid black" }}>
//               <th style={{ border: "1px solid black", padding: 4 }}>Sl. No</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Description of Goods</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>HSN/SAC</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Quantity</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Rate</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Disc. %</th>
//               <th style={{ border: "1px solid black", padding: 4 }}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, idx) => {
//               const product = products.find((p) => p.id === item.product_id);
//               const discAmount = item.price * item.quantity * (item.discount / 100);
//               const amount = (item.price * item.quantity) - discAmount;

//               return (
//                 <tr key={idx}>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{idx + 1}</td>
//                   <td style={{ border: "1px solid black", padding: 4 }}>
//                     <div><strong>{product?.productname || item.productname}</strong></div>
//                     <div>Serials: {product?.serial_numbers?.join(", ") || "N/A"}</div>
//                   </td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{product?.hsncode || "N/A"}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{item.quantity}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "right" }}>{Number(item.price).toFixed(2)}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "center" }}>{item.discount}</td>
//                   <td style={{ border: "1px solid black", padding: 4, textAlign: "right" }}>{amount.toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Total */}
//         <div style={{ marginTop: 15, fontWeight: "bold", textAlign: "right" }}>
//           Total Amount: ₹ {Number(invoice.total_amount).toFixed(2)}
//         </div>

//         {/* GST & Bank Details */}
//         <div style={{ marginTop: 15, borderTop: "1px solid black", paddingTop: 10 }}>
//           <div><strong>GST Number:</strong> {company.gst_number}</div>
//           <div><strong>PAN Number:</strong> {company.pan_number}</div>
//           <div style={{ marginTop: 10 }}>
//             <strong>Bank Details:</strong><br />
//             <div>{company.account_holder_1_name}, {company.bank_name_1}, A/c: {company.account_number_1}, IFSC: {company.ifsc_code_1}</div>
//             <div>{company.account_holder_2_name}, {company.bank_name_2}, A/c: {company.account_number_2}, IFSC: {company.ifsc_code_2}</div>
//           </div>
//           <div style={{ marginTop: 10 }}>
//             <strong>Terms & Conditions:</strong><br />
//             <div>{company.terms_and_conditions}</div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" }}>
//           This is a Computer Generated Invoice
//         </div>
//       </div>

//       {/* Print Button */}
//       <div className="mt-4">
//         <button
//           onClick={handlePrint}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: "#007bff",
//             border: "none",
//             color: "white",
//             borderRadius: 4,
//             cursor: "pointer",
//           }}
//         >
//           Download PDF / Print Invoice
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InvoicePage;





// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";

// function InvoicePage({ invoiceId }) {
//   const [company, setCompany] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [invoice, setInvoice] = useState(null);
//   const componentRef = useRef();

//   const fetchCompany = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getProfile");
//       setCompany(res.data);
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllCustomers");
//       const customersArray = Array.isArray(res.data.data) ? res.data.data : [];
//       setCustomers(customersArray);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllVendorProducts");
//       const productsArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.products)
//           ? res.data.products
//           : [];
//       setProducts(productsArray);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const fetchInvoice = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllInvoices");
//       const inv = Array.isArray(res.data) ? res.data.find((inv) => inv.id === invoiceId) : null;
//       setInvoice(inv);
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCompany();
//     fetchCustomers();
//     fetchProducts();
//     fetchInvoice();
//   }, [invoiceId]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // if (!company || !invoice) return
//   if (!company || !invoice) {
//     return <div style={{ textAlign: "center", padding: 20 }}>Loading invoice data...</div>;
//   }

//   const customer = customers.find((c) => c.id === invoice.customer_id);

//   const formattedInvoiceNo = `${company.invoice_prefix}-${String(invoice.id).padStart(4, "0")}`;

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <div ref={componentRef} style={{ padding: 20, fontFamily: "Arial, sans-serif", fontSize: 13, color: "#000" }}>
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid black", paddingBottom: 10 }}>
//           <div style={{ width: "60%" }}>
//             <h2 style={{ fontWeight: "bold", fontSize: 18 }}>{company.company_name}</h2>
//             <div>{company.address_1}, {company.pin_code_1}</div>
//             <div>{company.state_name_1} - Code: {company.state_gst_code_1}</div>
//             <div><strong>GSTIN/UIN:</strong> {company.gst_number}</div>
//             <div><strong>Email:</strong> {company.email}</div>
//             <div><strong>Contact:</strong> {company.contact_person_1_name} - {company.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "35%", border: "1px solid black", padding: 10, fontWeight: "bold", fontSize: 14 }}>
//             <div style={{ marginBottom: 6 }}><strong>Invoice No:</strong> {formattedInvoiceNo}</div>
//             <div><strong>Date:</strong> {dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}</div>
//             <div><strong>Terms:</strong> 50% on Delivery, 50% 45 Days PDC</div>
//           </div>
//         </div>

//         {/* Ship To / Bill To */}
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, border: "1px solid black", padding: 12 }}>
//           <div style={{ width: "48%" }}>
//             <strong style={{ textDecoration: "underline" }}>Consignee (Ship to):</strong><br />
//             <div><strong>{customer?.customer_name}</strong></div>
//             <div>{customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}</div>
//             <div>GSTIN: <strong>{customer?.gst_number}</strong></div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//           <div style={{ width: "48%" }}>
//             <strong style={{ textDecoration: "underline" }}>Buyer (Bill to):</strong><br />
//             <div><strong>{customer?.customer_name}</strong></div>
//             <div>{customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}</div>
//             <div>GSTIN: <strong>{customer?.gst_number}</strong></div>
//             <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid black" }}>
//               <th style={tableHeader}>Sl. No</th>
//               <th style={tableHeader}>Description of Goods</th>
//               <th style={tableHeader}>HSN/SAC</th>
//               <th style={tableHeader}>Quantity</th>
//               <th style={tableHeader}>Rate</th>
//               <th style={tableHeader}>Disc. %</th>
//               <th style={tableHeader}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, idx) => {
//               const product = products.find((p) => p.id === item.product_id);
//               const discAmount = item.price * item.quantity * (item.discount / 100);
//               const amount = item.price * item.quantity - discAmount;

//               return (
//                 <tr key={idx}>
//                   <td style={tableCellCenter}>{idx + 1}</td>
//                   <td style={tableCellLeft}>
//                     <strong>{product?.productname || item.productname}</strong><br />
//                     Serials: {product?.serial_numbers?.join(", ") || "N/A"}
//                   </td>
//                   <td style={tableCellCenter}>{product?.hsncode || "N/A"}</td>
//                   <td style={tableCellCenter}>{item.quantity}</td>
//                   <td style={tableCellRight}>₹ {Number(item.price).toFixed(2)}</td>
//                   <td style={tableCellCenter}>{item.discount}</td>
//                   <td style={tableCellRight}>₹ {amount.toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Total */}
//         <div style={{ marginTop: 20, fontWeight: "bold", textAlign: "right", fontSize: 14, borderTop: "2px solid black", paddingTop: 8 }}>
//           Total Amount: ₹ {Number(invoice.total_amount).toFixed(2)}
//         </div>

//         {/* GST & Bank Details */}
//         <div style={{ marginTop: 25, borderTop: "1px dashed #444", paddingTop: 10 }}>
//           <div><strong>GST Number:</strong> {company.gst_number}</div>
//           <div><strong>PAN Number:</strong> {company.pan_number}</div>
//           <div style={{ marginTop: 12 }}>
//             <strong style={{ textDecoration: "underline" }}>Bank Details:</strong><br />
//             <div>{company.account_holder_1_name}, {company.bank_name_1}, A/c: {company.account_number_1}, IFSC: {company.ifsc_code_1}</div>
//             <div>{company.account_holder_2_name}, {company.bank_name_2}, A/c: {company.account_number_2}, IFSC: {company.ifsc_code_2}</div>
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <strong style={{ textDecoration: "underline" }}>Terms & Conditions:</strong><br />
//             <div>{company.terms_and_conditions}</div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" }}>
//           This is a Computer Generated Invoice
//         </div>
//       </div>

//       {/* Print Button */}
//       <div className="mt-4" style={{ textAlign: "center" }}>
//         <button
//           onClick={handlePrint}
//           disabled={!company || !invoice}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: !company || !invoice ? "#ccc" : "#007bff",
//             border: "none",
//             color: "white",
//             borderRadius: 4,
//             fontSize: 14,
//             cursor: !company || !invoice ? "not-allowed" : "pointer",
//           }}
//         >
//           Download PDF / Print Invoice
//         </button>

//       </div>
//     </div>
//   );
// }

// export default InvoicePage;

// // Common styles
// const tableHeader = {
//   border: "1px solid black",
//   padding: 6,
//   fontWeight: "bold",
//   textAlign: "center",
// };

// const tableCellLeft = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "left",
// };

// const tableCellCenter = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "center",
// };

// const tableCellRight = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "right",
// };


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";

// function InvoicePage({ invoiceId }) {
//   const [company, setCompany] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [invoice, setInvoice] = useState(null);
//   const componentRef = useRef(null);

//   const fetchCompany = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getProfile");
//       console.log("fetchCompany response:", res.data);
//       setCompany(res.data);
//     } catch (error) {
//       console.error("Error fetching company:", error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllCustomers");
//       const customersArray = Array.isArray(res.data.data) ? res.data.data : [];
//       console.log("fetchCustomers response:", customersArray);
//       setCustomers(customersArray);
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllVendorProducts");
//       const productsArray = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.products)
//           ? res.data.products
//           : [];
//       console.log("fetchProducts response:", productsArray);
//       setProducts(productsArray);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const fetchInvoice = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/getAllInvoices");
//       console.log("fetchInvoice response:", res.data);
//       const inv = Array.isArray(res.data) ? res.data.find((inv) => inv.id === invoiceId) : null;
//       console.log("Selected invoice for id", invoiceId, ":", inv);
//       setInvoice(inv);
//     } catch (error) {
//       console.error("Error fetching invoice:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("Starting data fetch for invoiceId:", invoiceId);
//     fetchCompany();
//     fetchCustomers();
//     fetchProducts();
//     fetchInvoice();
//   }, [invoiceId]);

//   // We can't track ref changes via useEffect dependency, but we can log in render

//   const handlePrint = useReactToPrint({
//     content: () => {
//       if (!componentRef.current) {
//         console.error("Error: componentRef.current is undefined when printing!");
//         return null;
//       }
//       console.log("handlePrint called - componentRef.current:", componentRef.current);
//       return componentRef.current;
//     },
//     documentTitle: `Invoice_${invoice ? invoice.id : "unknown"}`, // optional
//   });

//   const onPrintClick = () => {
//     console.log("Print button clicked");
//     console.log("company state:", company);
//     console.log("invoice state:", invoice);
//     console.log("componentRef.current at print click:", componentRef.current);
//     if (!componentRef.current) {
//       console.error("Print aborted: componentRef.current is null or undefined!");
//       alert("Print not ready yet, please wait a moment and try again.");
//       return;
//     }
//     handlePrint();
//   };

//   if (!company || !invoice) {
//     console.log("Render: Loading invoice data... company or invoice is null");
//     return <div style={{ textAlign: "center", padding: 20 }}>Loading invoice data...</div>;
//   }

//   if (!invoice.items || invoice.items.length === 0) {
//     console.log("Render: Invoice items missing or empty.");
//     return <div style={{ textAlign: "center", padding: 20 }}>No items to display in invoice.</div>;
//   }

//   console.log("Render: company:", company);
//   console.log("Render: invoice:", invoice);
//   console.log("Render: componentRef.current:", componentRef.current);

//   const customer = customers.find((c) => c.id === invoice.customer_id);

//   const formattedInvoiceNo = `${company.invoice_prefix}-${String(invoice.id).padStart(4, "0")}`;

//   return (
//     <div className="p-4 max-w-5xl mx-auto">
//       <div
//         ref={componentRef}
//         style={{ padding: 20, fontFamily: "Arial, sans-serif", fontSize: 13, color: "#000" }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             borderBottom: "2px solid black",
//             paddingBottom: 10,
//           }}
//         >
//           <div style={{ width: "60%" }}>
//             <h2 style={{ fontWeight: "bold", fontSize: 18 }}>{company.company_name}</h2>
//             <div>
//               {company.address_1}, {company.pin_code_1}
//             </div>
//             <div>
//               {company.state_name_1} - Code: {company.state_gst_code_1}
//             </div>
//             <div>
//               <strong>GSTIN/UIN:</strong> {company.gst_number}
//             </div>
//             <div>
//               <strong>Email:</strong> {company.email}
//             </div>
//             <div>
//               <strong>Contact:</strong> {company.contact_person_1_name} - {company.contact_person_1_number}
//             </div>
//           </div>
//           <div
//             style={{
//               width: "35%",
//               border: "1px solid black",
//               padding: 10,
//               fontWeight: "bold",
//               fontSize: 14,
//             }}
//           >
//             <div style={{ marginBottom: 6 }}>
//               <strong>Invoice No:</strong> {formattedInvoiceNo}
//             </div>
//             <div>
//               <strong>Date:</strong> {dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}
//             </div>
//             <div>
//               <strong>Terms:</strong> 50% on Delivery, 50% 45 Days PDC
//             </div>
//           </div>
//         </div>

//         {/* Ship To / Bill To */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 20,
//             border: "1px solid black",
//             padding: 12,
//           }}
//         >
//           <div style={{ width: "48%" }}>
//             <strong style={{ textDecoration: "underline" }}>Consignee (Ship to):</strong>
//             <br />
//             <div>
//               <strong>{customer?.customer_name}</strong>
//             </div>
//             <div>
//               {customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}
//             </div>
//             <div>
//               GSTIN: <strong>{customer?.gst_number}</strong>
//             </div>
//             <div>
//               Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}
//             </div>
//           </div>
//           <div style={{ width: "48%" }}>
//             <strong style={{ textDecoration: "underline" }}>Buyer (Bill to):</strong>
//             <br />
//             <div>
//               <strong>{customer?.customer_name}</strong>
//             </div>
//             <div>
//               {customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}
//             </div>
//             <div>
//               GSTIN: <strong>{customer?.gst_number}</strong>
//             </div>
//             <div>
//               Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}
//             </div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid black" }}>
//               <th style={tableHeader}>Sl. No</th>
//               <th style={tableHeader}>Description of Goods</th>
//               <th style={tableHeader}>HSN/SAC</th>
//               <th style={tableHeader}>Quantity</th>
//               <th style={tableHeader}>Rate</th>
//               <th style={tableHeader}>Disc. %</th>
//               <th style={tableHeader}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.items.map((item, idx) => {
//               const product = products.find((p) => p.id === item.product_id);
//               const discAmount = item.price * item.quantity * (item.discount / 100);
//               const amount = item.price * item.quantity - discAmount;

//               return (
//                 <tr key={idx}>
//                   <td style={tableCellCenter}>{idx + 1}</td>
//                   <td style={tableCellLeft}>
//                     <strong>{product?.productname || item.productname}</strong>
//                     <br />
//                     Serials: {product?.serial_numbers?.join(", ") || "N/A"}
//                   </td>
//                   <td style={tableCellCenter}>{product?.hsncode || "N/A"}</td>
//                   <td style={tableCellCenter}>{item.quantity}</td>
//                   <td style={tableCellRight}>₹ {Number(item.price).toFixed(2)}</td>
//                   <td style={tableCellCenter}>{item.discount}</td>
//                   <td style={tableCellRight}>₹ {amount.toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Total */}
//         <div
//           style={{
//             marginTop: 20,
//             fontWeight: "bold",
//             textAlign: "right",
//             fontSize: 15,
//             borderTop: "2px solid black",
//             paddingTop: 8,
//           }}
//         >
//           Total Amount: ₹ {Number(invoice.total_amount).toFixed(2)}

          
//         </div>

//         {/* GST & Bank Details */}
//         <div style={{ marginTop: 25, borderTop: "1px dashed #444", paddingTop: 10 }}>
//           <div>
//             <strong>GST Number:</strong> {company.gst_number}
//           </div>
//           <div>
//             <strong>PAN Number:</strong> {company.pan_number}
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <strong style={{ textDecoration: "underline" }}>Bank Details:</strong>
//             <br />
//             <div>
//               {company.account_holder_1_name}, {company.bank_name_1}, A/c: {company.account_number_1}, IFSC:{" "}
//               {company.ifsc_code_1}
//             </div>
//             <div>
//               {company.account_holder_2_name}, {company.bank_name_2}, A/c: {company.account_number_2}, IFSC:{" "}
//               {company.ifsc_code_2}
//             </div>
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <strong style={{ textDecoration: "underline" }}>Terms & Conditions:</strong>
//             <br />
//             <div>{company.terms_and_conditions}</div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div style={{ marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" }}>
//           This is a Computer Generated Invoice
//         </div>
//       </div>

//       {/* Print Button */}
//       <div className="mt-4" style={{ textAlign: "center" }}>
//         <button
//           onClick={onPrintClick}
//           disabled={!company || !invoice || !componentRef.current}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: !company || !invoice || !componentRef.current ? "#ccc" : "#007bff",
//             border: "none",
//             color: "white",
//             borderRadius: 4,
//             fontSize: 14,
//             cursor: !company || !invoice || !componentRef.current ? "not-allowed" : "pointer",
//           }}
//           title={!company || !invoice || !componentRef.current ? "Please wait until invoice is fully loaded" : "Print Invoice"}
//         >
//           Download PDF / Print Invoice
//         </button>
//       </div>
//     </div>
//   );
// }

// export default InvoicePage;

// // Common styles
// const tableHeader = {
//   border: "3px solid black",
//   padding: 6,
//   fontWeight: "bold",
//   textAlign: "center",
// };

// const tableCellLeft = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "left",
// };

// const tableCellCenter = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "center",
// };

// const tableCellRight = {
//   border: "1px solid black",
//   padding: 6,
//   textAlign: "right",
// };





import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";

function InvoicePage({ invoiceId }) {
  const [company, setCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const componentRef = useRef(null);

  const fetchCompany = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/getProfile");
      setCompany(res.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/getAllCustomers");
      const customersArray = Array.isArray(res.data.data) ? res.data.data : [];
      setCustomers(customersArray);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/getAllVendorProducts");
      const productsArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.products)
        ? res.data.products
        : [];
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/getAllInvoices");
      const inv = Array.isArray(res.data) ? res.data.find((inv) => inv.id === invoiceId) : null;
      setInvoice(inv);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchCustomers();
    fetchProducts();
    fetchInvoice();
  }, [invoiceId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${invoice ? invoice.id : "unknown"}`,
  });

  const onPrintClick = () => {
    if (!componentRef.current) {
      alert("Print not ready yet, please wait a moment and try again.");
      return;
    }
    handlePrint();
  };

  if (!company || !invoice) {
    return <div style={{ textAlign: "center", padding: 20 }}>Loading invoice data...</div>;
  }

  if (!invoice.items || invoice.items.length === 0) {
    return <div style={{ textAlign: "center", padding: 20 }}>No items to display in invoice.</div>;
  }

  const customer = customers.find((c) => c.id === invoice.customer_id);
  const formattedInvoiceNo = `${company.invoice_prefix}-${String(invoice.id).padStart(4, "0")}`;

  let totalGSTAmount = 0;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div ref={componentRef} style={{ padding: 20, fontFamily: "Arial, sans-serif", fontSize: 13, color: "#000" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid black", paddingBottom: 10 }}>
          <div style={{ width: "60%" }}>
            <h2 style={{ fontWeight: "bold", fontSize: 18 }}>{company.company_name}</h2>
            <div>{company.address_1}, {company.pin_code_1}</div>
            <div>{company.state_name_1} - Code: {company.state_gst_code_1}</div>
            <div><strong>GSTIN/UIN:</strong> {company.gst_number}</div>
            <div><strong>Email:</strong> {company.email}</div>
            <div><strong>Contact:</strong> {company.contact_person_1_name} - {company.contact_person_1_number}</div>
          </div>
          <div style={{ width: "35%", border: "1px solid black", padding: 10, fontWeight: "bold", fontSize: 14 }}>
            <div style={{ marginBottom: 6 }}><strong>Invoice No:</strong> {formattedInvoiceNo}</div>
            <div><strong>Date:</strong> {dayjs(invoice.invoice_date).format("DD-MMM-YYYY")}</div>
            <div><strong>Terms:</strong> 50% on Delivery, 50% 45 Days PDC</div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, border: "1px solid black", padding: 12 }}>
          <div style={{ width: "48%" }}>
            <strong style={{ textDecoration: "underline" }}>Consignee (Ship to):</strong><br />
            <div><strong>{customer?.customer_name}</strong></div>
            <div>{customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}</div>
            <div>GSTIN: <strong>{customer?.gst_number}</strong></div>
            <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
          </div>
          <div style={{ width: "48%" }}>
            <strong style={{ textDecoration: "underline" }}>Buyer (Bill to):</strong><br />
            <div><strong>{customer?.customer_name}</strong></div>
            <div>{customer?.address_1}, {customer?.state_name_1} - {customer?.pin_code_1}</div>
            <div>GSTIN: <strong>{customer?.gst_number}</strong></div>
            <div>Contact: {customer?.contact_person_1_name} - {customer?.contact_person_1_number}</div>
          </div>
        </div>

        {/* Product Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid black" }}>
              <th style={tableHeader}>Sl. No</th>
              <th style={tableHeader}>Description of Goods</th>
              <th style={tableHeader}>HSN/SAC</th>
              <th style={tableHeader}>Quantity</th>
              <th style={tableHeader}>Rate</th>
              <th style={tableHeader}>Disc. %</th>
              <th style={tableHeader}>CGST %</th>
              <th style={tableHeader}>SGST %</th>
              <th style={tableHeader}>IGST %</th>
              <th style={tableHeader}>GST Amt</th>
              <th style={tableHeader}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => {
              const product = products.find((p) => p.id === item.product_id);
              const quantity = Number(item.quantity);
              const price = Number(item.price);
              const discountPercent = Number(item.discount);
              const cgstPercent = Number(item.cgst);
              const sgstPercent = Number(item.sgst);
              const igstPercent = Number(item.igst);

              const gross = price * quantity;
              const discount = gross * (discountPercent / 100);
              const taxableAmount = gross - discount;

              const cgstAmt = taxableAmount * (cgstPercent / 100);
              const sgstAmt = taxableAmount * (sgstPercent / 100);
              const igstAmt = taxableAmount * (igstPercent / 100);
              const gstTotal = cgstAmt + sgstAmt + igstAmt;

              totalGSTAmount += gstTotal;

              const finalAmount = taxableAmount + gstTotal;

              return (
                <tr key={idx}>
                  <td style={tableCellCenter}>{idx + 1}</td>
                  <td style={tableCellLeft}>
                    <strong>{product?.productname || item.productname}</strong><br />
                    Serials: {product?.serial_numbers?.join(", ") || "N/A"}
                  </td>
                  <td style={tableCellCenter}>{product?.hsncode || "N/A"}</td>
                  <td style={tableCellCenter}>{quantity}</td>
                  <td style={tableCellRight}>₹ {price.toFixed(2)}</td>
                  <td style={tableCellCenter}>{discountPercent}%</td>
                  <td style={tableCellCenter}>{cgstPercent}%</td>
                  <td style={tableCellCenter}>{sgstPercent}%</td>
                  <td style={tableCellCenter}>{igstPercent}%</td>
                  <td style={tableCellRight}>₹ {gstTotal.toFixed(2)}</td>
                  <td style={tableCellRight}>₹ {finalAmount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginTop: 20, fontWeight: "bold", textAlign: "right", fontSize: 15 }}>
          Total GST Amount: ₹ {totalGSTAmount.toFixed(2)} <br />
          Total Amount: ₹ {Number(invoice.total_amount).toFixed(2)}
        </div>

        {/* GST & Bank Details */}
        <div style={{ marginTop: 25, borderTop: "1px dashed #444", paddingTop: 10 }}>
          <div><strong>GST Number:</strong> {company.gst_number}</div>
          <div><strong>PAN Number:</strong> {company.pan_number}</div>
          <div style={{ marginTop: 12 }}>
            <strong style={{ textDecoration: "underline" }}>Bank Details:</strong><br />
            <div>{company.account_holder_1_name}, {company.bank_name_1}, A/c: {company.account_number_1}, IFSC: {company.ifsc_code_1}</div>
            <div>{company.account_holder_2_name}, {company.bank_name_2}, A/c: {company.account_number_2}, IFSC: {company.ifsc_code_2}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <strong style={{ textDecoration: "underline" }}>Terms & Conditions:</strong><br />
            <div>{company.terms_and_conditions}</div>
          </div>
        </div>

        <div style={{ marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" }}>
          This is a Computer Generated Invoice
        </div>
      </div>

      {/* Print Button */}
      {/* <div className="mt-4" style={{ textAlign: "center" }}>
        <button
          onClick={onPrintClick}
          disabled={!company || !invoice || !componentRef.current}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            border: "none",
            color: "white",
            borderRadius: 4,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Download PDF / Print Invoice
        </button>
      </div> */}
    </div>
  );
}

export default InvoicePage;

// Table styles
const tableHeader = {
  border: "1px solid black",
  padding: 6,
  fontWeight: "bold",
  textAlign: "center",
};

const tableCellLeft = {
  border: "1px solid black",
  padding: 6,
  textAlign: "left",
};

const tableCellCenter = {
  border: "1px solid black",
  padding: 6,
  textAlign: "center",
};

const tableCellRight = {
  border: "1px solid black",
  padding: 6,
  textAlign: "right",
};

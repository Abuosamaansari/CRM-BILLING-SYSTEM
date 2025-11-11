import React from 'react';

export default function Dashboard() {
  const stats = {
    customers: 124,
    invoices: 58,
    revenue: 98500,
    pendingPayments: 12,
  };

  const recentActivities = [
    { id: 1, type: 'New Invoice', message: 'Invoice #1023 created for John Doe', time: '2 hours ago' },
    { id: 2, type: 'New Customer', message: 'Jane Smith added as customer', time: 'Yesterday' },
    { id: 3, type: 'Payment Received', message: '₹15,000 received from ABC Ltd.', time: '2 days ago' },
    { id: 4, type: 'Invoice Overdue', message: 'Invoice #1005 is overdue by 5 days', time: '3 days ago' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">CRM Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value={stats.customers} />
        <StatCard title="Invoices Generated" value={stats.invoices} />
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
        <StatCard title="Pending Payments" value={stats.pendingPayments} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map(act => (
            <li key={act.id} className="py-3">
              <p className="font-medium text-gray-700">{act.message}</p>
              <p className="text-sm text-gray-500">{act.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-indigo-600 mt-2">{value}</h2>
    </div>
  );
}



// import React, { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import QRCode from "react-qr-code";
// import html2canvas from "html2canvas";
// import imageCompression from "browser-image-compression";
// import jsPDF from "jspdf";

// export default function DownloadInvoice() {
//   const navigate = useNavigate();

//   const invoiceRef = useRef(null);

//   const generatePDF = async () => {
//     const input = invoiceRef.current;
//     const originalBodyWidth = document.body.style.width;
//     document.body.style.width = `${input.scrollWidth + 100}%`;
  
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 100));
  
//       const canvas = await html2canvas(input, {
//         useCORS: true,
//         scrollY: -window.scrollY,
//         scale: 3,
//         logging: true,
//         windowWidth: document.documentElement.offsetWidth,
//         windowHeight: input.scrollHeight,
//       });
  
//       const imgData = canvas.toDataURL("image/jpeg", 0.5);
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
//       let position = 0;
//       let heightLeft = pdfHeight;
  
//       pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
//       heightLeft -= pdf.internal.pageSize.height;
  
//       while (heightLeft >= 0) {
//         position = heightLeft - pdfHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
//         heightLeft -= pdf.internal.pageSize.height;
//       }
  
//       pdf.save("invoice.pdf");
//     } catch (error) {
//       console.error("PDF  error", error);
//     } finally {
//       document.body.style.width = originalBodyWidth;
//     }
//   };
  
  

//   return (
//     <>
//       <button onClick={() => navigate("/invoice")} class="text-right mr-1 ">
//         Back
//       </button>

//       <div
//         ref={invoiceRef}
//         class="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-xl"
//       >
//         <div class="container border border-black-400">
//           <div class="grid grid-cols-1 sm:grid-cols-2 p-4 m-3 gap-4">
//             <div class="w-auto">
//               <div class="font-semibold"></div>
//             </div>
//             <div class="w-auto">
//               <div class="flex justify-end mr-5 mb-4">
//                 <QRCode
//                   value="https://example.com"
//                   size={200}
//                   bgColor="#ffffff"
//                   fgColor="#000000"
//                   level="H"
//                 />
//               </div>
//             </div>
//             <div class="w-auto border border-black-300 p-2">
//               <div class="font-semibold">
//                 <h1>Seller</h1>
//                 <h1 class="text-xl font-semibold">
//                   ASH Information Technologies Pvt Ltd
//                 </h1>
//                 <p>Add: Sector 51, Noida, UP</p>
//                 <p>GSTIN/UIN: 07AAUCA6928L1ZW</p>
//                 <p>Contact: KK Sharma 8595838900</p>
//                 <p>Email: toakash920@gmail.com</p>
//               </div>
//             </div>
//             <div>
//               <table class="table-fixed w-full max-w-4xl mx-auto border border-black-300">
//                 <thead>
//                   <tr>
//                     <th class="w-1/2 px-4 py-2 border border-black-300">
//                       Invoice No. ASH/25-26/095
//                     </th>
//                     <th class="w-1/2 px-4 py-2 border border-black-300">
//                       e-Way Bill No. ASH/25-26/095
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td class="w-1/2 px-4 py-2 border border-black-300">
//                       Buyer's Order No. : PO/ONE-29464
//                     </td>
//                     <td class="w-1/2 px-4 py-2 border border-black-300">
//                       Dated : 15 Jun 2025
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="w-1/2 px-4 py-2 border border-black-300">
//                       Reference : Akash Sagar
//                     </td>
//                     <td class="w-1/2 px-4 py-2 border border-black-300">
//                       Delivery Note: Payment of Terms
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             <div class="border border-black-300 p-2">
//               <div class="font-semibold">
//                 <h1>Bill to</h1>
//                 <h1 class="text-xl font-semibold">
//                   M/s A One Technology Solutions
//                 </h1>
//                 <p>
//                   Shop No -6, 1st, Kanti Devi Complex, Near Shiv Shakti Durga
//                   Mandir, Sector-53, Gautambuddha Nagar
//                 </p>
//                 <p>GSTIN/UIN : 09CMFPS3802P1ZG</p>
//                 <p>State Name : Uttar Pradesh, Code : 09</p>
//                 <p>Contact : 0120 2497800</p>
//                 <p>Email: toakash920@gmail.com</p>
//               </div>
//             </div>
//             <div class="border border-black-300 p-2">
//               <div class="font-semibold">
//                 <h1>Shipping</h1>
//                 <h1 class="text-xl font-semibold">
//                   M/s A One Technology Solutions
//                 </h1>
//                 <p>
//                   Shop No -6, 1st, Kanti Devi Complex, Near Shiv Shakti Durga
//                   Mandir, Sector-53, Gautambuddha Nagar
//                 </p>
//                 <p>GSTIN/UIN : 09CMFPS3802P1ZG</p>
//                 <p>State Name : Uttar Pradesh, Code : 09</p>
//                 <p>Contact : 0120 2497800</p>
//                 <p>Email: toakash920@gmail.com</p>
//               </div>
//             </div>
//           </div>
//           <div class="table_details m-3 p-4 w-auto mt-3">
//             <div class="overflow-x-auto">
//               <table class="table-auto min-w-full w-full max-w-4xl mx-auto border border-black-300">
//                 <thead class="hidden sm:table-header-group">
//                   <tr>
//                     <th class="border p-2">S.N.</th>
//                     <th class="border p-2 text-left">Description of Goods</th>
//                     <th class="border p-2">HSSN/SAC</th>
//                     <th class="border p-2">Qty.</th>
//                     <th class="border p-2">Unit</th>
//                     <th class="border p-2">Unit Price (Rs.)</th>
//                     <th class="border p-2">Taxable Amount</th>
//                     <th class="border p-2">GST Rate</th>
//                     <th class="border p-2">Line Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr class="odd:bg-white even:bg-black-50">
//                     <td class="border p-2">1</td>
//                     <td class="border p-2 whitespace-pre-wrap sm:hidden md:table-cell">
//                       it.description
//                     </td>
//                     <td class="border p-2 text-center">8471</td>
//                     <td class="border p-2 text-center">1</td>
//                     <td class="border p-2 text-center">No.</td>
//                     <td class="border p-2 text-right">₹35,000</td>
//                     <td class="border p-2 text-right">₹35,000.00</td>
//                     <td class="border p-2 text-center">18%</td>
//                     <td class="border p-2 text-right">₹38,500.00</td>
//                   </tr>
//                   <tr>
//                     <td
//                       colspan="5"
//                       rowspan="3"
//                       class="border border-black-300 px-4 py-2 text-center"
//                     >
//                       Thirty-eight thousand five hundred rupees only.
//                     </td>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       Total
//                     </td>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       ₹38,500.00
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       Round-off
//                     </td>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       0.00
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       Grand Total
//                     </td>
//                     <td class="border border-black-300 px-4 py-2" colspan="2">
//                       ₹38,500.00
//                     </td>
//                   </tr>
//                 </tbody>
//                 <thead class="mt-3">
//                   <tr>
//                     <th class="border border-black-300 px-4 py-2">S.N.</th>
//                     <th class="border border-black-300 px-4 py-2">Tax Rate</th>
//                     <th class="border border-black-300 px-4 py-2">
//                       Taxable Amount
//                     </th>
//                     <th colspan="2" class="border border-black-300 px-4 py-2">
//                       CGST
//                     </th>
//                     <th colspan="2" class="border border-black-300 px-4 py-2">
//                       SGST
//                     </th>
//                     <th colspan="2" class="border border-black-300 px-4 py-2">
//                       IGST
//                     </th>
//                   </tr>
//                   <tr>
//                     <th
//                       class="border border-black-300 px-4 py-2"
//                       colspan="3"
//                     ></th>
//                     <th class="border border-black-300 px-4 py-2">Rate</th>
//                     <th class="border border-black-300 px-4 py-2">Amount</th>
//                     <th class="border border-black-300 px-4 py-2">Rate</th>
//                     <th class="border border-black-300 px-4 py-2">Amount</th>
//                     <th class="border border-black-300 px-4 py-2">Rate</th>
//                     <th class="border border-black-300 px-4 py-2">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td class="border border-black-300 px-4 py-2">1</td>
//                     <td class="border border-black-300 px-4 py-2">28%</td>
//                     <td class="border border-black-300 px-4 py-2">0.00</td>
//                     <td class="border border-black-300 px-4 py-2">0%</td>
//                     <td class="border border-black-300 px-4 py-2">0.00</td>
//                     <td class="border border-black-300 px-4 py-2">6</td>
//                     <td class="border border-black-300 px-4 py-2">7</td>
//                     <td class="border border-black-300 px-4 py-2">8</td>
//                     <td class="border border-black-300 px-4 py-2">9</td>
//                   </tr>
//                   <tr>
//                     <td class="border border-black-300 px-4 py-2">2</td>
//                     <td class="border border-black-300 px-4 py-2">18%</td>
//                     <td class="border border-black-300 px-4 py-2">0.00</td>
//                     <td class="border border-black-300 px-4 py-2">0%</td>
//                     <td class="border border-black-300 px-4 py-2">0.00</td>
//                     <td class="border border-black-300 px-4 py-2">6</td>
//                     <td class="border border-black-300 px-4 py-2">7</td>
//                     <td class="border border-black-300 px-4 py-2">8</td>
//                     <td class="border border-black-300 px-4 py-2">9</td>
//                   </tr>
//                   <tr>
//                     <th colspan="3" class="border border-black-300 px-4 py-2">
//                       Total Tax Amount
//                     </th>
//                     <th
//                       colspan="2"
//                       class="border border-black-300 px-4 py-2 text-right"
//                     >
//                       000
//                     </th>
//                     <th
//                       colspan="2"
//                       class="border border-black-300 px-4 py-2 text-right"
//                     >
//                       000
//                     </th>
//                     <th
//                       colspan="2"
//                       class="border border-black-300 px-4 py-2 text-right"
//                     >
//                       000
//                     </th>
//                   </tr>
//                 </tbody>
//               </table>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2  mt-2">
//                 {/* Terms & Conditions */}
//                 <div className="condition border border-black-300 p-4">
//                   <h1 className="text-lg font-semibold">Terms & Conditions</h1>
//                   <p className="text-sm text-black-600 mb-2 italic">E. & O.E</p>
//                   <ol className="list-decimal list-inside text-sm space-y-2 text-black-700">
//                     <li>
//                       Goods once sold will not be taken back. Only replacement
//                       will be provided wherever applicable.
//                     </li>
//                     <li>
//                       Interest @18% p.a. will be charged if the payment is not
//                       made within stipulated time.
//                     </li>
//                     <li>
//                       Payment to be made in the form of cheque/IMPS/NEFT/UPI.
//                     </li>
//                     <li>Courier charges applicable for outstation delivery.</li>
//                     <li>All prices mentioned above are in INR only.</li>
//                     <li>
//                       Warranty applicable on Hardware Items only &{" "}
//                       <span className="font-semibold uppercase">
//                         does not include
//                       </span>{" "}
//                       — "Liquid or Physical Damage, fire Burn, Data Loss, Screen
//                       damage, Screen Lines, Application Support, Battery and
//                       Charger, any sort of Accessories". Warranty void if
//                       Hardware is found tempered.
//                     </li>
//                   </ol>
//                 </div>

//                 {/* Bank Details */}
//                 <div className="banks_details border border-black-300 p-4 space-y-4">
//                   <div className="banks">
//                     <h1 className="text-lg font-semibold mb-3">Bank Details</h1>
//                     <p className="text-sm text-black-700">
//                       <span className="font-medium">Account:</span> 37120437224
//                     </p>
//                     <p className="text-sm text-black-700">
//                       <span className="font-medium">Bank:</span> SBI
//                     </p>
//                     <p className="text-sm text-black-700">
//                       <span className="font-medium">IFSC Code:</span> 1900SBI
//                     </p>
//                   </div>

//                   {/* Stamp */}
//                   <div className="stamp border-t border-black-300 pt-4">
//                     <h1 className="text-sm text-black-700">
//                       ASH Information Technologies Pvt Ltd
//                     </h1>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button onClick={generatePDF} className="btn btn-primary">
//             Download PDF
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getAllCompanies } from '../Api/apiServices';

export const getAllInvoices = () => axios.get('http://localhost:4000/api/getAllInvoices');

export default function InvoiceListAndView() {
  const [invoices, setInvoices] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [company, setCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [errorCompanies, setErrorCompanies] = useState(null);
  const [errorInvoices, setErrorInvoices] = useState(null);

  useEffect(() => {
    setLoadingCompanies(true);
    getAllCompanies()
      .then(res => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setCompany(data[data.length - 1]); // ✅ Last company
          setErrorCompanies(null);
        } else {
          setCompany(null);
          setErrorCompanies('No companies found');
        }
      })
      .catch(err => {
        setErrorCompanies(err.message || 'Error fetching companies');
        setCompany(null);
      })
      .finally(() => setLoadingCompanies(false));
  }, []);

  useEffect(() => {
    setLoadingInvoices(true);
    getAllInvoices()
      .then(res => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          setInvoices(data);
          setErrorInvoices(null);
        } else {
          setInvoices([]);
          setErrorInvoices('Unexpected invoices data format');
        }
      })
      .catch(err => {
        setErrorInvoices(err.message || 'Error fetching invoices');
        setInvoices([]);
      })
      .finally(() => setLoadingInvoices(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 tracking-wide">Invoices</h1>

      {loadingInvoices ? (
        <p className="text-center text-gray-500">Loading invoices...</p>
      ) : errorInvoices ? (
        <p className="text-center text-red-600">{errorInvoices}</p>
      ) : !selectedId ? (
        <>
          {invoices.length === 0 ? (
            <p className="text-center text-gray-400 italic">No invoices found.</p>
          ) : (
            <ul className="border rounded-lg shadow-md max-h-[520px] overflow-auto divide-y divide-gray-200">
              {invoices.map(inv => (
                <li
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-indigo-50 transition"
                  title="Click to view invoice"
                >
                  <div>
                    <p className="font-semibold text-indigo-700 text-lg">{inv.customer_name || 'Unnamed Customer'}</p>
                    <p className="text-sm text-gray-600">
                      Invoice #{inv.invoice_number || 'N/A'} |{' '}
                      {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">ID: {inv.id}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedId(null)}
            className="mb-6 px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            ← Back to list
          </button>

          <ViewInvoiceWrapper
            id={selectedId}
            company={company}
            loadingCompany={loadingCompanies}
            errorCompany={errorCompanies}
          />
        </>
      )}
    </div>
  );
}

function ViewInvoiceWrapper({ id, company, loadingCompany, errorCompany }) {
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [errorInvoice, setErrorInvoice] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    if (!id) return;

    setLoadingInvoice(true);
    axios
      .get(`http://localhost:4000/api/getInvoiceById/${id}`)
      .then(res => {
        const data = res.data?.data;
        if (data?.invoice) {
          setInvoice(data.invoice);
          setItems(data.items || []);
          setErrorInvoice(null);
        } else {
          setInvoice(null);
          setItems([]);
          setErrorInvoice('Invoice data not found.');
        }
      })
      .catch(err => {
        setErrorInvoice(err.message || 'Error fetching invoice.');
        setInvoice(null);
        setItems([]);
      })
      .finally(() => setLoadingInvoice(false));
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoice?.invoice_number || id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    import('html2pdf.js').then(html2pdf => {
      html2pdf.default().set(opt).from(invoiceRef.current).save();
    });
  };

  if (loadingInvoice) return <div className="p-6 text-gray-600">Loading invoice...</div>;
  if (errorInvoice) return <div className="p-6 text-red-600">{errorInvoice}</div>;

  const logoPath = invoice?.logo_url || company?.logo_url || '';
  const logoUrl =
    logoPath.startsWith('http') || logoPath === ''
      ? logoPath
      : `http://localhost:4000${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 max-w-4xl mx-auto font-serif print:max-w-full print:p-0">
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
        >
          🖨 Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition"
        >
          ⬇ Download PDF
        </button>
      </div>

      <div ref={invoiceRef} className="border border-gray-300 rounded p-6">
        {/* Header */}
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 mb-1 tracking-wide">Invoice</h1>
            <p className="text-lg font-semibold">{invoice?.company_name || company?.name || ''}</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
              Registration No: {company?.registration_number || '-'}<br />
              {invoice?.company_address || company?.address || ''}<br />
              {company?.city ? company.city + ', ' : ''}{company?.state ? company.state + ', ' : ''}{company?.country || ''} - {company?.postal_code || ''}<br />
              Email: {company?.email || '-'}<br />
              Phone: {company?.phone || '-'}<br />
              Website: {company?.website ? (
                <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                  {company.website}
                </a>
              ) : '-'}<br />
              Industry: {company?.industry_type || '-'}
            </p>
          </div>

          {logoUrl && (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="h-50 w-80 object-contain rounded-md border border-gray-200"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>


        {/* Invoice & Customer Info */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <h2 className="font-semibold mb-2 text-indigo-700">Bill To:</h2>
            <p className="font-medium">{invoice?.customer_name}</p>
            <p className="text-gray-600">Customer ID: #{invoice?.customer_id}</p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Invoice No:</span> {invoice?.invoice_number}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{' '}
              {invoice?.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-lg font-bold mt-4">
              Total Amount: <span className="text-indigo-700">₹{invoice?.total_amount}</span>
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse text-sm">
          <thead className="bg-indigo-100 text-indigo-900 font-semibold">
            <tr>
              <th className="border border-indigo-200 p-3 text-center">#</th>
              <th className="border border-indigo-200 p-3">Product</th>
              <th className="border border-indigo-200 p-3 text-center">Qty</th>
              <th className="border border-indigo-200 p-3 text-right">Price</th>
              <th className="border border-indigo-200 p-3 text-right">Discount</th>
              <th className="border border-indigo-200 p-3 text-right">CGST</th>
              <th className="border border-indigo-200 p-3 text-right">SGST</th>
              <th className="border border-indigo-200 p-3 text-right">IGST</th>
              <th className="border border-indigo-200 p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const total = (
                item.quantity *
                (parseFloat(item.selling_price) -
                  parseFloat(item.discount || 0) +
                  parseFloat(item.cgst || 0) +
                  parseFloat(item.sgst || 0) +
                  parseFloat(item.igst || 0))
              ).toFixed(2);

              return (
                <tr key={item.id} className="even:bg-gray-50">
                  <td className="border border-indigo-200 p-2 text-center">{i + 1}</td>
                  <td className="border border-indigo-200 p-2">{item.productname}</td>
                  <td className="border border-indigo-200 p-2 text-center">{item.quantity}</td>
                  <td className="border border-indigo-200 p-2 text-right">₹{item.selling_price}</td>
                  <td className="border border-indigo-200 p-2 text-right">₹{item.discount || '0'}</td>
                  <td className="border border-indigo-200 p-2 text-right">₹{item.cgst || '0'}</td>
                  <td className="border border-indigo-200 p-2 text-right">₹{item.sgst || '0'}</td>
                  <td className="border border-indigo-200 p-2 text-right">₹{item.igst || '0'}</td>
                  <td className="border border-indigo-200 p-2 text-right font-semibold">₹{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 text-right text-xl font-bold text-indigo-800">
          Grand Total: ₹{invoice?.total_amount}
        </div>

        {invoice?.remarks && (
          <div className="mt-4 italic text-gray-700 border-t border-gray-300 pt-3">
            <strong>Remarks:</strong> {invoice.remarks}
          </div>
        )}

        <div className="mt-12 text-center text-xs text-gray-500">
          Thank you for your business!
        </div>
      </div>
    </div>
  );
}

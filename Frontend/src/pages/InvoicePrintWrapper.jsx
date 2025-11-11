// src/pages/InvoicePrintWrapper.js
import { useParams } from "react-router-dom";
import InvoicePrint from "../components/InvoicePrint";

function InvoicePrintWrapper() {
  const { invoiceId } = useParams();

  return <InvoicePrint invoiceId={parseInt(invoiceId)} />;
}

export default InvoicePrintWrapper;

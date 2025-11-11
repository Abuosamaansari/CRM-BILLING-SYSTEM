import React ,{useState} from 'react';
 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Loginpage/Register';
import Login from './Loginpage/Login';
import VerifyOtp from './Loginpage/VerifyOtp';
import Home from './pages/Home';
import VendorList from './pages/VendorList';
import CustomerPage from './pages/CustomerPage'; // Assuming you have a CustomerPage component
import ProductPage  from './pages/ProductPage';
import VendorProductPage from './pages/VendorProductPage';
import InvoicePage from './pages/InvoicePage';
import StockSummary from '../src/pages/StockSummary';
import CreatePurchaseOrder from '../src/pages/CreatePurchaseOrder'; 
 import ViewInvoice from '../src/pages/ViewInvoice';
 import CompanyProfile  from './pages/CompanyProfile';
 import InvoicePrintWrapper from "./pages/InvoicePrintWrapper";
 import Sidebar from './components/Sidebar'
 import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './utils/AuthContext';
 

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const {token} = useAuth();
  return (
    <>
   
   {
    !token && (
      <>
         <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />
       </Routes>
      </>
    )
   }
     
    
     
       {token && (
         <>
              <div  className="flex min-h-screen">

<Sidebar/>
<div
className={`flex-1 transition-all duration-300 p-5
    ${isDrawerOpen ? "lg:ml-0" : "lg:ml-16"}
  `}>

  <Routes>
  <Route path="/home" element={<Home />} />
<Route path="/vendors" element={<VendorList />} />
<Route path="/customers" element={<CustomerPage />} />
<Route path="/products" element={<ProductPage />}/>
<Route path="/vendor-products" element={<VendorProductPage />} />
<Route path="/invoices" element={<InvoicePage />} />
<Route path="/stock-summary" element={<StockSummary />} />
<Route path="/create-purchase-order" element={<CreatePurchaseOrder />} />
<Route path="/view-invoice/:id" element={<ViewInvoice />} />
<Route path="/companyprofile" element={<CompanyProfile />} />
<Route path="/invoice-print/:invoiceId" element={<InvoicePrintWrapper />} />
  </Routes>
</div>

</div>
         </>

       )

       }
        
     
    </>
  );
}

export default App;

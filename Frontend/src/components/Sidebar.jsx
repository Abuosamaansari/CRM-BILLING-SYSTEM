import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaTachometerAlt,
  FaTruck,
  FaUsers,
  FaBoxOpen,
  FaIndustry,
  FaFileInvoiceDollar,
  FaChartBar,
  FaClipboardList,
  FaEye,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
 import { logout } from "../Api/authApi";

const menuItems = [
  { to: "/companyprofile", label: "Company Profile", icon: <FaBuilding /> },
  { to: "/home", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/vendors", label: "Vendors", icon: <FaTruck /> },
  { to: "/customers", label: "Customers", icon: <FaUsers /> },
  { to: "/products", label: "Products (Simple)", icon: <FaBoxOpen /> },
  { to: "/vendor-products", label: "Vendor Products", icon: <FaIndustry /> },
  { to: "/invoices", label: "Invoices", icon: <FaFileInvoiceDollar /> },
  { to: "/stock-summary", label: "Stock Summary", icon: <FaChartBar /> },
  { to: "/create-purchase-order", label: "Purchase Order", icon: <FaClipboardList /> },
  { to: "/view-invoice", label: "View Invoice", icon: <FaEye /> },
   
];

const Layout = ({ children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Function to check active route (including dynamic ones like /view-invoice/:id)
  const isRouteActive = (route) => {
    if (route.includes(":")) {
      return location.pathname.startsWith(route.split("/:")[0]);
    }
    return location.pathname === route;
  };

  const handleLogout = () => {
    logout();  
    navigate("/login");  
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-900 text-gray-200 fixed top-0 left-0 h-full shadow-lg transition-all duration-300 ease-in-out`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className={`font-bold text-lg tracking-wide ${!isOpen && "hidden"}`}>
            ASV CRM
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu */}
        <ul className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const active = isRouteActive(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul>
  <button
     onClick={handleLogout}
    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-300 ease-in-out"
  >
    <IoIosLogOut className="h-5 w-5" />
    <span >Logout</span>
  </button>
</ul>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

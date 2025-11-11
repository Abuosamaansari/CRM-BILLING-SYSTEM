import axios from 'axios';

// Create a unified API client
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api', // Adjust for prod/deploy as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👤 Authentication
export const registerUser = (data) => apiClient.post('/register', data)
;
export const loginUser = (data) => apiClient.post('/login', data)
;
export const verifyOtp = (data) => apiClient.post('/verifyOtp', data);

// 🏪 Vendor
export const registerVendor = (data) => apiClient.post('/registerVendor', data);
export const getAllVendors = () => apiClient.get('/getAllVendors');
export const getVendorById = (id) => apiClient.get(`/getVendorById/${id}`);
export const updateVendor = (id, data) => apiClient.put(`/updateVendorById/${id}`, data);
export const deleteVendor = (id) => apiClient.delete(`/deleteVendorById/${id}`);

// 👥 Customers
export const getAllCustomers = () => apiClient.get('/getAllCustomers');
export const registerCustomer = (data) => apiClient.post('/registerCustomer', data);
export const updateCustomer = (id, data) => apiClient.put(`/updateCustomerById/${id}`, data);
export const deleteCustomer = (id) => apiClient.delete(`/deleteCustomerById/${id}`);
export const getCustomerById = (id) => apiClient.get(`/getCustomerById/${id}`);



// 📦 Products
export const getAllProducts = () =>
  apiClient.get('/getAllProducts', {
    headers: {
      'Cache-Control': 'no-cache', // ⛔ Prevents 304 Not Modified issues
    },
  });

export const addSimpleProduct = (data) => apiClient.post('/addSimpleProduct', data);
export const updateProductById = (id, data) => apiClient.put(`/updateProductById/${id}`, data);
export const deleteProductById = (id) => apiClient.delete(`/deleteProductById/${id}`);


export const getStockSummery = () => apiClient.get('/getStockSummary');

export const createPO = (data) => apiClient.post('/createPO', data);

 // Company API Functions

export const createCompany = (data) => apiClient.post('/createCompany', data);
export const getAllCompanies = () => apiClient.get('/getAllCompanies');

export const getCompanyById = (id) => apiClient.get(`/getCompanyById/${id}`);
export const updateCompanyById = (id, data) => apiClient.put(`/updateCompanyById/${id}`, data);
export const deleteCompanyById = (id) => apiClient.delete(`/deleteCompanyById/${id}`);



export const getProfile = () => apiClient.get('/getProfile');

export const createProfile = (data) => apiClient.post('/createProfile', data);
export const updateProfile = (id, data) => apiClient.put(`/updateProfile/${id}`, data);
export const deleteProfile = (id) => apiClient.delete(`/deleteProfile/${id}`);
export const generateInvoiceNumber = () => apiClient.get('/generate-invoice-number');




// Categories API
export const addCategory = (data) => apiClient.post('/addCategory', data);

export const getAllCategories = () => apiClient.get('/getAllCategories');

export const getCategoryById = (id) => apiClient.get(`/getCategoryById/${id}`);

export const updateCategoryById = (id, data) => apiClient.put(`/updateCategoryById/${id}`, data);

export const deleteCategoryById = (id) => apiClient.delete(`/deleteCategoryById/${id}`);
///////
// Vendor Products API
export const addVendorProduct = (data) => apiClient.post('/addVendorProduct', data);

export const getAllVendorProducts = () => apiClient.get('/getAllVendorProducts');

export const getVendorProductById = (id) => apiClient.get(`/getVendorProductById/${id}`);

export const updateVendorProductById = (id, data) => apiClient.put(`/updateVendorProductById/${id}`, data);

export const deleteVendorProductById = (id) => apiClient.delete(`/deleteVendorProductById/${id}`);


// 🧾 Invoices

export const createInvoice = (data) => apiClient.post('/createInvoice', data);

export const getAllInvoices = () => apiClient.get('/getAllInvoices');

export const getInvoiceById = (id) => apiClient.get(`/getInvoiceById/${id}`);

export const updateInvoiceById = (id, data) => apiClient.put(`/updateInvoiceById/${id}`, data);

export const deleteInvoiceById = (id) => apiClient.delete(`/deleteInvoiceById/${id}`);








// 🏠 Dashboard / Home
export const getHomeData = (token) =>
  apiClient.get('/home', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const express = require('express');
const router = express.Router();
const userController = require('../controler/controler');
const auth = require('../Middleware/auth');



router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verifyOtp', userController.verifyOtp);
router.get('/home', auth.verifyToken, userController.home);
//  Vendor Management api end points

router.post('/registerVendor',userController.registerVendor);
router.get('/getAllVendors', userController.getAllVendors);
router.get('/getVendorById/:id', userController.getVendorById);
router.put('/updateVendorById/:id', userController.updateVendorById);
router.delete('/deleteVendorById/:id', userController.deleteVendorById);

//////////////////////////////////////////////////////////////////////
router.post('/registerCustomer', userController.registerCustomer);
router.get('/getAllCustomers', userController.getAllCustomers);
router.get('/getCustomerById/:id', userController.getCustomerById);
router.delete('/deleteCustomerById/:id', userController.deleteCustomerById);
router.put('/updateCustomerById/:id', userController.updateCustomerById);


// ////////////////////////////////////////////////////////
// router.post('/addCategory', userController.addCategory);
// router.get('/getAllCategories', userController.getAllCategories);
// router.put('/updateCategory/:id', userController.updateCategory);
// router.delete('/deleteCategory/:id', userController.deleteCategory);

// router.post('/categories', userController.saveCategory);      // Create or update
// router.get('/categories', userController.getAllCategories);   // Read all
// router.delete('/categories/:id', userController.deleteCategory); 

/////////////////////////////////////////////////////////

// ✅ Add category with subcategories + serial numbers
router.post('/addCategory', userController.addCategory);

// ✅ Get all categories
router.get('/getAllCategories', userController.getAllCategories);

// ✅ Get category by ID (optional, agar chahiye toh)
router.get('/getCategoryById/:id', userController.getCategoryById);

// ✅ Update category by ID
router.put('/updateCategoryById/:id', userController.updateCategoryById);

// ✅ Delete category by ID
router.delete('/deleteCategoryById/:id', userController.deleteCategory);

/////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////
router.post('/addSimpleProduct', userController.addSimpleProduct);
router.get('/getAllProducts', userController.getAllProducts);
router.get('/getProductById/:id', userController.getProductById);
router.put('/updateProductById/:id', userController.updateProductById); 
router.delete('/deleteProductById/:id', userController.deleteProductById);



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// router.post('/addVendorProduct', userController.addVendorProduct);
// router.get('/getVendorProducts', userController.getVendorProducts);

// router.get('/getVendorProductById/:id', userController.getVendorProductById);
// router.put('/updateVendorProduct/:id', userController.updateVendorProduct);
// router.delete('/deleteVendorProduct/:id', userController.deleteVendorProduct);

router.post('/addVendorProduct', userController.addVendorProduct);

router.get('/getAllVendorProducts', userController.getAllVendorProducts);

router.get('/getVendorProductById/:id', userController.getVendorProductById);

router.put('/updateVendorProductById/:id', userController.updateVendorProduct);

router.delete('/deleteVendorProductById/:id', userController.deleteVendorProduct);

///////////////
router.get('/getStockSummary', userController.getStockSummary);


/////////////////////
router.post('/createPO', userController.createPO);


////////////////////
router.post('/receiveGoods/:id', userController.receiveGoods);

//////////////////////////////////////////////


// // Create new invoice
// router.post('/createInvoice', userController.createInvoice);

// // Get all invoices
// router.get('/getAllInvoices', userController.getAllInvoices);

// // Get single invoice by ID
// router.get('/getInvoiceById/:id', userController.getInvoiceById);

// // Update invoice by ID
// router.put('/updateInvoice/:id', userController.updateInvoice);

// // Delete invoice by ID
// router.delete('/deleteInvoice/:id', userController.deleteInvoice);




// Create invoice



router.post('/createInvoice', userController.createInvoice);
router.get('/getAllInvoices', userController.getAllInvoices);
router.get('/getInvoiceById/:id', userController.getInvoiceById);
router.put('/updateInvoiceById/:id', userController.updateInvoiceById);
router.delete('/deleteInvoiceById/:id', userController.deleteInvoiceById);



////////////////////////////////////////////////////////////
router.post('/proformainvoices', userController.proformainvoices);
router.get('/getallproformainvoices', userController.getallproformainvoices);
router.get('/getproformainvoicesbyid/:id', userController.getproformainvoicesbyid);
router.put('/updateproformainvoices/:id', userController.updateproformainvoices);
router.delete('/deleteproformainvoices/:id', userController.deleteproformainvoices);


//////////////////////////////////////////////////////////////////
router.post('/createPayment', userController.createPayment);
router.get('/getAllPayments', userController.getAllPayments);
router.get('/getPaymentById/:id', userController.getPaymentById);
router.put('/updatePayment/:id', userController.updatePayment);
router.delete('/deletePayment/:id', userController.deletePayment);



router.post('/createCompany', userController.createCompany);
router.get('/getAllCompanies', userController.getAllCompanies);
router.get('/getCompanyById/:id', userController.getCompanyById);
router.put('/updateCompanyById/:id', userController.updateCompanyById);
router.delete('/deleteCompanyById/:id', userController.deleteCompanyById);


router.get('/getProfile', userController.getProfile);
router.post('/createProfile', userController.createProfile);
router.put('/updateProfile/:id', userController.updateProfile);
router.delete('/deleteProfile/:id', userController.deleteProfile);
router.get('/generate-invoice-number', userController.generateInvoiceNumber);











module.exports = router;


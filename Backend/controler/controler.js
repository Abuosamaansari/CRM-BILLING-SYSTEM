const bcrypt = require('bcrypt');
const database = require('../config/database');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
const vendorModel = require('../model/model');
const customerModel = require('../model/customer');
const categoryModel = require('../model/categoryModel');
const productModel = require('../model/productModel');
const model = require('../model/vendorProductModel');
const reportModel = require('../model/reportModel');
const poModel = require('../model/poModel');
const grnModel = require('../model/grnModel');
const invoiceModel = require('../model/invoiceModel');
const proformaModel = require('../model/proformaInvoiceModel');
const paymentModel = require('../model/paymentModel');
const companyModel = require('../model/companyModel');

// const companyProfileModel = require('../model/companyProfileModel');

const CompanyProfile = require('../model/companyProfileModel');








// 🧠 Date formatting helpers
function formatDateForMySQL(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateTimeForMySQL(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function formatDateTimeForMySQL(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}




const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
    user: 'ansariabuosama7@gmail.com', 
    // pass: 'qrvx nxni mcwy spkz'
    pass: 'bwee xowd dzbm xmuw' // use app password here
  }
});



exports.register = async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = `INSERT INTO crm_tbl (username, email, phone, password) VALUES (?, ?, ?, ?)`;

  database.query(insertQuery, [username, email, phone, hashedPassword], (err, result) => {
    if (err) {
      console.error('❌ Registration error:', err);
      return res.status(500).json({ error: 'Registration failed' });
    }

    res.status(201).json({ message: '✅ Registered successfully!' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM crm_tbl WHERE username = ?`;
     console.log("username", username)
  database.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins
     console.log("Otp", otp)
    // ✅ Save OTP to database
    const updateOTP = `UPDATE crm_tbl SET otp = ?, otpExpires = ? WHERE id = ?`;

    database.query(updateOTP, [otp, expiry, user.id], async (otpErr) => {
      if (otpErr) {
        console.error('❌ OTP update failed:', otpErr);
        return res.status(500).json({ error: 'Failed to set OTP' });
      }

      // ✅ Send OTP via email
      const mailOptions = {
        from: 'ansariabuosama7@gmail.com',
        to: user.email,
        subject: '🔐 Your CRM Login OTP',
        text: `Hi ${user.username},\n\nYour OTP is: ${otp}\n\n(Valid for 5 minutes)\n\n- CRM Team`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📤 OTP sent to ${user.email}: ${otp}`);

        return res.status(200).json({
          message: '✅ OTP sent to your email address',
          username: user.username, // frontend needs this for /verify
        });
      } catch (emailErr) {
        console.error('❌ Email sending failed:', emailErr);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }
    });
  });
};

exports.verifyOtp = (req, res) => {
  const { username, otp } = req.body;

  const query = `SELECT * FROM crm_tbl WHERE username = ? AND otp = ?`;

  database.query(query, [username, otp], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const user = results[0];
    const now = new Date();


    if (now > user.otp_expiry) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // ✅ Clear OTP from crm_tbl (not users)
    database.query(
      `UPDATE crm_tbl SET otp = NULL, otp_expiry = NULL WHERE id = ?`,
      [user.id]
    );

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: '✅ OTP verified, login success!',
      token
    });
  });
};

exports.registerVendor = async (req, res) => {
  try {
    const vendorData = req.body;

    // Basic validation
    if (!vendorData.vendorename || !vendorData.email || !vendorData.phone_number) {
      return res.status(400).json({ error: 'vendorename, email and phone_number are required.' });
    }

    // Insert vendor using model function
    const result = await vendorModel.insertVendor(vendorData);

    res.status(201).json({
      message: 'Vendor registered successfully',
      vendorId: result.insertId,
    });
  } catch (error) {
    console.error('Error registering vendor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllVendors = async (req, res) => {
  try {
    const filters = req.query; // { vendorename: "ABC", city: "Delhi" }

    const vendors = await vendorModel.getAllVendors(filters);

    res.json({ count: vendors.length, data: vendors });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getVendorById = async (req, res) => {
  const { id } = req.params;

  try {
    const vendor = await vendorModel.getVendorById(id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateVendorById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Format dates
  if (updatedData.date_of_registration) {
    updatedData.date_of_registration = formatDateForMySQL(updatedData.date_of_registration);
  }

  if (updatedData.created_at) {
    updatedData.created_at = formatDateTimeForMySQL(updatedData.created_at);
  }

  if (updatedData.updated_at) {
    updatedData.updated_at = formatDateTimeForMySQL(updatedData.updated_at);
  }

  try {
    const result = await vendorModel.updateVendorById(id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found or nothing updated' });
    }

    res.json({ message: '✅ Vendor updated successfully' });
  } catch (error) {
    console.error('❌ Error updating vendor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteVendorById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await vendorModel.deleteVendorById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ message: '🗑️ Vendor deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting vendor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// controllers/customerController.js

// Helper to format ISO date string to MySQL DATETIME (YYYY-MM-DD HH:MM:SS)
function formatDateTimeForMySQL(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



exports.registerCustomer = async (req, res) => {
  try {
    const customerData = req.body;

    if (!customerData.customer_name || !customerData.phone_number) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    // Format dates if provided
    if (customerData.created_at) {
      customerData.created_at = formatDateTimeForMySQL(customerData.created_at);
    }
    if (customerData.updated_at) {
      customerData.updated_at = formatDateTimeForMySQL(customerData.updated_at);
    }

    const result = await customerModel.insertCustomer(customerData);

    res.status(201).json({
      message: '✅ Customer registered successfully',
      customerId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error registering customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();
    res.json({ count: customers.length, data: customers });
  } catch (error) {
    console.error('❌ Error fetching customers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerModel.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('❌ Error getting customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerModel.deleteCustomerById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: '🗑️ Customer deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCustomerById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Format dates if provided
  if (updatedData.created_at) {
    updatedData.created_at = formatDateTimeForMySQL(updatedData.created_at);
  }
  if (updatedData.updated_at) {
    updatedData.updated_at = formatDateTimeForMySQL(updatedData.updated_at);
  }

  try {
    const result = await customerModel.updateCustomerById(id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found or nothing updated' });
    }

    res.json({ message: '✅ Customer updated successfully' });
  } catch (error) {
    console.error('❌ Error updating customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////////


// // Create or update full category + subcategories + serials
// exports.saveCategory = (req, res) => {
//   const { category, subcategories } = req.body;

//   const isNewCategory = !category.id;
//   const catSql = isNewCategory
//     ? "INSERT INTO categories (name, description) VALUES (?, ?)"
//     : "UPDATE categories SET name = ?, description = ? WHERE id = ?";

//   const catValues = isNewCategory
//     ? [category.name, category.description]
//     : [category.name, category.description, category.id];

//   database.query(catSql, catValues, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const categoryId = isNewCategory ? result.insertId : category.id;

//     const subPromises = subcategories.map((sub) => {
//       return new Promise((resolve, reject) => {
//         const isNewSub = !sub.id;
//         const subSql = isNewSub
//           ? "INSERT INTO subcategories (category_id, subvariant_name, color) VALUES (?, ?, ?)"
//           : "UPDATE subcategories SET subvariant_name = ?, color = ? WHERE id = ?";

//         const subValues = isNewSub
//           ? [categoryId, sub.subvariant_name, sub.color]
//           : [sub.subvariant_name, sub.color, sub.id];

//         database.query(subSql, subValues, (subErr, subResult) => {
//           if (subErr) return reject(subErr);

//           const subcategoryId = isNewSub ? subResult.insertId : sub.id;
//           const serials = sub.serial_numbers || [];

//           if (serials.length === 0) return resolve();

//           const serialSql = `
//             INSERT INTO subcategory_serials (subcategory_id, serial_number)
//             VALUES ${serials.map(() => '(?, ?)').join(', ')}
//             ON DUPLICATE KEY UPDATE serial_number = serial_number
//           `;
//           const serialValues = serials.flatMap(sn => [subcategoryId, sn]);

//           database.query(serialSql, serialValues, (serialErr) => {
//             if (serialErr) return reject(serialErr);
//             resolve();
//           });
//         });
//       });
//     });

//     Promise.all(subPromises)
//       .then(() => res.json({ message: "Category and subcategories saved successfully" }))
//       .catch((e) => res.status(500).json({ error: e.message }));
//   });
// };

// // Get all
// exports.getAllCategories = (req, res) => {
//   const sql = "SELECT * FROM categories ORDER BY id DESC";
//   database.query(sql, async (err, categories) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (!categories.length) return res.json([]);

//     const categoryIds = categories.map(cat => cat.id);
//     const subSql = `SELECT * FROM subcategories WHERE category_id IN (?)`;
//     database.query(subSql, [categoryIds], (subErr, subs) => {
//       if (subErr) return res.status(500).json({ error: subErr.message });

//       const subIds = subs.map(s => s.id);
//       const serialSql = `SELECT * FROM subcategory_serials WHERE subcategory_id IN (?)`;
//       database.query(serialSql, [subIds], (serialErr, serials) => {
//         if (serialErr) return res.status(500).json({ error: serialErr.message });

//         const structured = categories.map(cat => {
//           const catSubs = subs
//             .filter(s => s.category_id === cat.id)
//             .map(s => ({
//               ...s,
//               serial_numbers: serials
//                 .filter(sn => sn.subcategory_id === s.id)
//                 .map(sn => sn.serial_number)
//             }));
//           return { ...cat, subcategories: catSubs };
//         });

//         res.json(structured);
//       });
//     });
//   });
// };

// // Delete category
// exports.deleteCategory = (req, res) => {
//   const id = req.params.id;
//   const sql = "DELETE FROM categories WHERE id = ?";
//   database.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Category deleted" });
//   });
// };


// 🔄 Common method for inserting or updating category
const addOrUpdateCategory = (data) => {
  return new Promise((resolve, reject) => {
    const { category, subcategories } = data;
    const isNewCategory = !category.id;

    const catSql = isNewCategory
      ? "INSERT INTO categories (name, description) VALUES (?, ?)"
      : "UPDATE categories SET name = ?, description = ? WHERE id = ?";
    const catValues = isNewCategory
      ? [category.name, category.description]
      : [category.name, category.description, category.id];

    database.query(catSql, catValues, (err, result) => {
      if (err) return reject(err);

      const categoryId = isNewCategory ? result.insertId : category.id;

      // Handle subcategories
      const subTasks = subcategories.map(sub => {
        return new Promise((res, rej) => {
          const isNewSub = !sub.id;
          const subSql = isNewSub
            ? "INSERT INTO subcategories (category_id, subvariant_name, color) VALUES (?, ?, ?)"
            : "UPDATE subcategories SET subvariant_name = ?, color = ? WHERE id = ?";
          const subValues = isNewSub
            ? [categoryId, sub.subvariant_name, sub.color]
            : [sub.subvariant_name, sub.color, sub.id];

          database.query(subSql, subValues, (subErr, subResult) => {
            if (subErr) return rej(subErr);
            const subcategoryId = isNewSub ? subResult.insertId : sub.id;

            const serials = sub.serial_numbers || [];
            if (serials.length === 0) return res();

            // Insert serials (ignore duplicates)
            const serialSql = `
              INSERT INTO subcategory_serials (subcategory_id, serial_number)
              VALUES ${serials.map(() => '(?, ?)').join(', ')}
              ON DUPLICATE KEY UPDATE serial_number = serial_number
            `;
            const serialValues = serials.flatMap(sn => [subcategoryId, sn]);

            database.query(serialSql, serialValues, (serialErr) => {
              if (serialErr) return rej(serialErr);
              res();
            });
          });
        });
      });

      Promise.all(subTasks)
        .then(() => resolve({ message: 'Category saved successfully', categoryId }))
        .catch(reject);
    });
  });
};

// 🔹 POST /addCategory
exports.addCategory = async (req, res) => {
  try {
    const result = await addOrUpdateCategory(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET /getAllCategories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await getAllCategoriesData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET /getCategoryById/:id
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getAllCategoriesData(id);
    res.json(result[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 PUT /updateCategoryById/:id
exports.updateCategoryById = async (req, res) => {
  try {
    req.body.category.id = parseInt(req.params.id, 10);
    const result = await addOrUpdateCategory(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 DELETE /deleteCategoryById/:id
// exports.deleteCategory = async (req, res) => {
//   try {
//     const id = req.params.id;
//     await database.query("DELETE FROM categories WHERE id = ?", [id]);
//     res.json({ message: 'Category deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await categoryModel.deleteCategory(id); // your existing model fn returns Promise
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 🧠 Helper: Get all categories, or single (if id given)
const getAllCategoriesData = (filterId = null) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT c.id AS category_id, c.name AS category_name, c.description,
             sc.id AS sub_id, sc.subvariant_name, sc.color,
             ss.serial_number, ss.is_sold
      FROM categories c
      LEFT JOIN subcategories sc ON sc.category_id = c.id
      LEFT JOIN subcategory_serials ss ON ss.subcategory_id = sc.id
    `;
    const params = [];

    if (filterId) {
      sql += ` WHERE c.id = ?`;
      params.push(filterId);
    }

    sql += ` ORDER BY c.id DESC, sc.id, ss.id`;

    database.query(sql, params, (err, rows) => {
      if (err) return reject(err);

      const categories = {};
      rows.forEach(row => {
        if (!categories[row.category_id]) {
          categories[row.category_id] = {
            id: row.category_id,
            name: row.category_name,
            description: row.description,
            subcategories: []
          };
        }

        if (row.sub_id) {
          let sub = categories[row.category_id].subcategories.find(s => s.id === row.sub_id);
          if (!sub) {
            sub = {
              id: row.sub_id,
              subvariant_name: row.subvariant_name,
              color: row.color,
              serial_numbers: []
            };
            categories[row.category_id].subcategories.push(sub);
          }

          if (row.serial_number) {
            sub.serial_numbers.push({
              serial_number: row.serial_number,
              is_sold: !!row.is_sold
            });
          }
        }
      });

      resolve(Object.values(categories));
    });
  });
};

/////////////////////////////////
///////////////////////////////////
// ✅ Add simple product
exports.addSimpleProduct = async (req, res) => {
  try {
    const result = await productModel.addSimpleProduct(req.body);
    res.status(201).json({ message: "✅ Product added", productId: result.insertId });
  } catch (err) {
    console.error("❌", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all
exports.getAllProducts = async (req, res) => {
  try {
    const result = await productModel.getAllProducts();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update
exports.updateProductById = async (req, res) => {
  try {
    const result = await productModel.updateProductById(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "✅ Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete
exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // ✅ Log the product ID you're trying to delete
    console.log("➡️ Deleting product ID:", productId);

    // ✅ Call the model function
    const result = await productModel.deleteProductById(productId);

    // ✅ Log the result returned from the model
    console.log("🗑️ Delete result:", result);

    // ✅ Handle case when no product was found
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Product not found" });
    }

    // ✅ Success
    res.status(200).json({ message: "✅ Product deleted successfully" });

  } catch (err) {
    // ✅ Log error to console
    console.error("❌ Error deleting product:", err);

    // ✅ Send error response
    res.status(500).json({ error: "❌ Server error while deleting product" });
  }
};
//////////////////////////////////////////////////
////////////////////////////////////////////////

// exports.addVendorProduct = async (req, res) => {
//   try {
//     const out = await model.addVendorProduct(req.body);
//     res.status(201).json({ message: "✅ Vendor product added", productId: out.prodResult.insertId });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Server error adding vendor product" });
//   }
// };

// exports.getVendorProducts = async (req, res) => {
//   try {
//     const items = await model.getVendorProducts();
//     res.json(items);
//   } catch (e) {
//     res.status(500).json({ error: "Server error fetching vendor products" });
//   }
// };

// exports.getVendorProductById = async (req, res) => {
//   try {
//     const item = await model.getVendorProductById(req.params.id);
//     if (!item) return res.status(404).json({ error: "Not found" });
//     res.json(item);
//   } catch (e) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.updateVendorProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { prodData, vpData } = req.body;
//     const result = await model.updateVendorProduct(id, prodData, vpData);
//     if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
//     res.json({ message: "✅ Vendor product updated" });
//   } catch (e) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.deleteVendorProduct = async (req, res) => {
//   try {
//     const result = await model.deleteVendorProduct(req.params.id);
//     if (result.affectedRows === 0) return res.status(404).json({ error: "Not found/deleted" });
//     res.json({ message: "✅ Vendor product deleted" });
//   } catch (e) {
//     res.status(500).json({ error: "Server error" });
//   }
// };


// 🔹 Add new product

exports.addVendorProduct = (req, res) => {
  const {
    productname, hsncode, itemcode, price, discount,
    gst, igst, cgst, sgst,
    category_id, subcategory_id, vendor_id,
    serial_numbers = []  // <-- from frontend
  } = req.body;

  const sqlProduct = `
    INSERT INTO addvendorproducts 
    (productname, hsncode, itemcode, price, discount, gst, igst, cgst, sgst, category_id, subcategory_id, vendor_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const productValues = [
    productname, hsncode, itemcode, price, discount,
    gst, igst, cgst, sgst,
    category_id || null, subcategory_id || null, vendor_id || null
  ];

  database.query(sqlProduct, productValues, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const productId = result.insertId;

    // insert serial numbers in product_serial_numbers table
    if (serial_numbers.length > 0) {
      const sqlSerial = `
        INSERT INTO product_serial_numbers (product_id, serial_number)
        VALUES ?
      `;
      const serialData = serial_numbers.map(sn => [productId, sn]);

      database.query(sqlSerial, [serialData], (serialErr) => {
        if (serialErr) return res.status(500).json({ error: serialErr.message });

        return res.json({ message: 'Product and serial numbers added successfully', id: productId });
      });
    } else {
      res.json({ message: 'Product added successfully', id: productId });
    }
  });
};


exports.getAllVendorProducts = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name, 
      sc.subvariant_name AS subcategory_name,
      v.vendorename AS vendor_name,
      GROUP_CONCAT(ps.serial_number) AS serial_numbers
    FROM addvendorproducts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN product_serial_numbers ps ON ps.product_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `;

  database.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const products = results.map(product => ({
      ...product,
      serial_numbers: product.serial_numbers ? product.serial_numbers.split(',') : []
    }));

    res.json(products);
  });
};


exports.getVendorProductById = (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name, 
      sc.subvariant_name AS subcategory_name,
      v.vendorename AS vendor_name,
      GROUP_CONCAT(ps.serial_number) AS serial_numbers
    FROM addvendorproducts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN product_serial_numbers ps ON ps.product_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  database.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

    const product = {
      ...results[0],
      serial_numbers: results[0].serial_numbers ? results[0].serial_numbers.split(',') : []
    };

    res.json(product);
  });
};



exports.updateVendorProduct = (req, res) => {
  const id = req.params.id;
  const {
    productname, hsncode, itemcode, price, discount,
    gst, igst, cgst, sgst,
    category_id, subcategory_id, vendor_id,
    serial_numbers = [] // <-- include from frontend if user sends
  } = req.body;

  const sql = `
    UPDATE addvendorproducts SET
      productname = ?, hsncode = ?, itemcode = ?, price = ?, discount = ?,
      gst = ?, igst = ?, cgst = ?, sgst = ?,
      category_id = ?, subcategory_id = ?, vendor_id = ?
    WHERE id = ?
  `;
  const values = [
    productname, hsncode, itemcode, price, discount,
    gst, igst, cgst, sgst,
    category_id || null, subcategory_id || null, vendor_id || null,
    id
  ];

  database.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // 🔁 If serial numbers are provided, update them
    if (serial_numbers.length > 0) {
      const deleteSQL = `DELETE FROM product_serial_numbers WHERE product_id = ?`;
      database.query(deleteSQL, [id], (deleteErr) => {
        if (deleteErr) return res.status(500).json({ error: deleteErr.message });

        const insertSQL = `INSERT INTO product_serial_numbers (product_id, serial_number) VALUES ?`;
        const serialData = serial_numbers.map(sn => [id, sn]);

        database.query(insertSQL, [serialData], (insertErr) => {
          if (insertErr) return res.status(500).json({ error: insertErr.message });

          return res.json({ message: 'Product and serial numbers updated successfully' });
        });
      });
    } else {
      res.json({ message: 'Product updated successfully' });
    }
  });
};



exports.deleteVendorProduct = (req, res) => {
  const id = req.params.id;
  database.query('DELETE FROM addvendorproducts WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
};



////////////////////////////////////////////////

exports.getStockSummary = async (req, res) => {
  try {
    const stockData = await reportModel.getStockSummary();
    res.json(stockData);
  } catch (error) {
    console.error("❌ Error in stock summary:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

////////////////////////////////////////////////

exports.createPO = async (req, res) => {
  const { poData, items } = req.body;

  if (!poData || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid PO data' });
  }

  try {
    const result = await poModel.createPO(poData, items);
    res.json({ message: '✅ PO created', po_id: result.po_id });
  } catch (error) {
    console.error("❌ Error creating PO:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

/////

exports.receiveGoods = async (req, res) => {
  const { po_id } = req.params;
  const { items, grnData } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items array' });
  }

  try {
    const result = await grnModel.receiveGoods(po_id, items, grnData);
    res.json({ message: '✅ Goods Received', grn_id: result.grn_id });
  } catch (error) {
    console.error("❌ Error receiving goods:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

//////////////////////////////////////////////////////////


// Invoice Controller




// 🔹 Create Invoice
exports.createInvoice = (req, res) => {
  invoiceModel.createInvoice(req.body)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};

// 🔹 Get All Invoices
exports.getAllInvoices = (req, res) => {
  invoiceModel.getAllInvoices()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};

// 🔹 Get Invoice by ID
exports.getInvoiceById = (req, res) => {
  invoiceModel.getInvoiceById(req.params.id)
    .then(data => {
      if (!data) return res.status(404).json({ message: 'Invoice not found' });
      res.json(data);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// 🔹 Update Invoice by ID
exports.updateInvoiceById = (req, res) => {
  invoiceModel.updateInvoice(req.params.id, req.body)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};

// 🔹 Delete Invoice by ID
exports.deleteInvoiceById = (req, res) => {
  invoiceModel.deleteInvoice(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};


////////////////////////////////////////////////////

exports.proformainvoices = (req, res) => {
  const { invoiceData, items } = req.body;
  proformaModel.createProformaInvoice(invoiceData, items, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(201).json({ success: true, message: 'Proforma invoice created', data: result });
  });
};

exports.getallproformainvoices = (req, res) => {
  proformaModel.getAllProformaInvoices((err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
};

exports.getproformainvoicesbyid = (req, res) => {
  const id = req.params.id;
  proformaModel.getProformaInvoiceById(id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!result) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: result });
  });
};

exports.updateproformainvoices = (req, res) => {
  const id = req.params.id;
  const { invoiceData, items } = req.body;
  proformaModel.updateProformaInvoice(id, invoiceData, items, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Proforma invoice updated', data: result });
  });
};

exports.deleteproformainvoices = (req, res) => {
  const id = req.params.id;
  proformaModel.deleteProformaInvoice(id, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Proforma invoice deleted' });
  });
};

//////////////////////////////////////////////

exports.createPayment = async (req, res) => {
  try {
    const paymentData = req.body.paymentData;
    const result = await paymentModel.createPayment(paymentData);
    res.status(201).json({ success: true, message: "Payment recorded", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error recording payment", error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payments", error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentModel.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payment", error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const paymentData = req.body.paymentData;
    const result = await paymentModel.updatePayment(req.params.id, paymentData);
    res.json({ success: true, message: "Payment updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating payment", error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const result = await paymentModel.deletePayment(req.params.id);
    res.json({ success: true, message: "Payment deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting payment", error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const result = await companyModel.insertCompany(req.body);
    res.status(201).json({ message: 'Company created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.getAllCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get company by id
exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update company by id
exports.updateCompanyById = async (req, res) => {
  try {
    const result = await companyModel.updateCompanyById(req.params.id, req.body);
    if (result.affectedRows === 0) 
      return res.status(404).json({ message: 'Company not found or no change made' });
    res.json({ message: 'Company updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete company by id
exports.deleteCompanyById = async (req, res) => {
  try {
    const result = await companyModel.deleteCompanyById(req.params.id);
    if (result.affectedRows === 0) 
      return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//////////////////////////////////////////////////////


exports.getProfile = (req, res) => {
  
  CompanyProfile.getProfile((err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0] || {});
  });
};

exports.createProfile = (req, res) => {
  CompanyProfile.checkIfExists((err, result) => {
    if (err) return res.status(500).json(err);
    if (result[0].count > 0) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    CompanyProfile.createProfile(req.body, (err2, result2) => {
      if (err2) return res.status(500).json(err2);
      res.status(201).json({ message: 'Profile created', id: result2.insertId });
    });
  });
};

exports.updateProfile = (req, res) => {
  const id = req.params.id;

  // ✅ Remove created_at if present
  if ('created_at' in req.body) {
    delete req.body.created_at;
  }

  CompanyProfile.updateProfile(id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Profile updated' });
  });
};


exports.deleteProfile = (req, res) => {
  const id = req.params.id;
  CompanyProfile.deleteProfile(id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Profile deleted' });
  });
};

exports.generateInvoiceNumber = (req, res) => {
  CompanyProfile.getProfile((err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: 'No company profile found' });

    const profile = result[0];
    const invoiceNo = `${profile.invoice_prefix}-${String(profile.current_invoice_number).padStart(4, '0')}`;

    CompanyProfile.incrementInvoiceNumber(profile.id, (updateErr) => {
      if (updateErr) return res.status(500).json(updateErr);
      res.json({ invoice_number: invoiceNo });
    });
  });
};


exports.home = (req, res) => {
  res.json({ message: `🏠 Welcome ${req.user.username}!`, user: req.user });
};





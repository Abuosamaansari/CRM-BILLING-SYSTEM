// // const database = require('../config/database'); // Use your DB connection file

// // // ✅ Add Vendor Product
// // exports.addVendorProduct = (data) => {
// //   return new Promise((res, rej) => {
// //     const {
// //       productname, hsncode, qntyyy, price, itemcode,
// //       discount, cgst, sgst, igst, category_id, warehouse_id,
// //       subcategory_id, // ✅ Added
// //       vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number
// //     } = data;

// //     const productSql = `
// //       INSERT INTO products
// //         (productname, hsncode, qntyyy, price, itemcode, discount, cgst, sgst, igst,
// //          category_id, warehouse_id, subcategory_id, is_vendor_product)
// //       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,TRUE)
// //     `;
// //     const productVals = [
// //       productname, hsncode, qntyyy, price, itemcode,
// //       discount, cgst, sgst, igst,
// //       category_id, warehouse_id, subcategory_id
// //     ];

// //     database.query(productSql, productVals, (err, prodResult) => {
// //       if (err) return rej(err);
// //       const prodId = prodResult.insertId;

// //       const vpSql = `
// //         INSERT INTO vendor_products
// //           (product_id, vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number)
// //         VALUES (?,?,?,?,?,?)
// //       `;
// //       const vpVals = [
// //         prodId, vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number
// //       ];

// //       database.query(vpSql, vpVals, (err2, vpResult) => {
// //         if (err2) return rej(err2);
// //         res({ prodResult, vpResult });
// //       });
// //     });
// //   });
// // };

// // // ✅ Get All Vendor Products
// // exports.getVendorProducts = () => {
// //   return new Promise((res, rej) => {
// //     const sql = `
// //       SELECT 
// //         p.*, vp.vendor_id, vp.purchase_price, vp.purchase_date, vp.quantity_purchased, vp.invoice_number,
// //         sc.subvariant_name, sc.color
// //       FROM products p
// //       JOIN vendor_products vp ON p.id = vp.product_id
// //       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
// //       ORDER BY p.id DESC
// //     `;
// //     database.query(sql, (err, result) => err ? rej(err) : res(result));
// //   });
// // };

// // // ✅ Get Vendor Product by ID
// // exports.getVendorProductById = (id) => {
// //   return new Promise((res, rej) => {
// //     const sql = `
// //       SELECT 
// //         p.*, vp.vendor_id, vp.purchase_price, vp.purchase_date, vp.quantity_purchased, vp.invoice_number,
// //         sc.subvariant_name, sc.color
// //       FROM products p
// //       JOIN vendor_products vp ON p.id = vp.product_id
// //       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
// //       WHERE p.id = ?
// //     `;
// //     database.query(sql, [id], (err, rows) => err ? rej(err) : res(rows[0]));
// //   });
// // };

// // // ✅ Update Vendor Product
// // exports.updateVendorProduct = (id, prodData, vpData) => {
// //   return new Promise((res, rej) => {
// //     const pFields = [], pVals = [];
// //     for (const k in prodData) {
// //       pFields.push(`${k} = ?`);
// //       pVals.push(prodData[k]);
// //     }

// //     const pSql = `UPDATE products SET ${pFields.join(', ')} WHERE id = ?`;
// //     pVals.push(id);

// //     database.query(pSql, pVals, (err1) => {
// //       if (err1) return rej(err1);

// //       const vpFields = [], vpVals = [];
// //       for (const k in vpData) {
// //         vpFields.push(`${k} = ?`);
// //         vpVals.push(vpData[k]);
// //       }

// //       const vpSql = `UPDATE vendor_products SET ${vpFields.join(', ')} WHERE product_id = ?`;
// //       vpVals.push(id);

// //       database.query(vpSql, vpVals, (err2, result) => err2 ? rej(err2) : res(result));
// //     });
// //   });
// // };

// // // ✅ Delete Vendor Product
// // exports.deleteVendorProduct = (id) => {
// //   return new Promise((res, rej) => {
// //     database.query('DELETE FROM vendor_products WHERE product_id = ?', [id], (e1) => {
// //       if (e1) return rej(e1);
// //       database.query('DELETE FROM products WHERE id = ?', [id], (e2, result) => e2 ? rej(e2) : res(result));
// //     });
// //   });
// // };
// const database = require('../config/database'); // Use your DB connection file

// // ✅ Add Vendor Product with serial numbers support
// exports.addVendorProduct = (data) => {
//   return new Promise((res, rej) => {
//     const {
//       productname, hsncode, qntyyy, price, itemcode,
//       discount, cgst, sgst, igst, category_id, warehouse_id,
//       subcategory_id, // ✅ Added
//       vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number,
//       serial_numbers // <-- expect this as array of strings
//     } = data;

//     const productSql = `
//       INSERT INTO products
//         (productname, hsncode, qntyyy, price, itemcode, discount, cgst, sgst, igst,
//          category_id, warehouse_id, subcategory_id, is_vendor_product)
//       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,TRUE)
//     `;
//     const productVals = [
//       productname, hsncode, qntyyy, price, itemcode,
//       discount, cgst, sgst, igst,
//       category_id, warehouse_id, subcategory_id
//     ];

//     database.query(productSql, productVals, (err, prodResult) => {
//       if (err) return rej(err);
//       const prodId = prodResult.insertId;

//       const vpSql = `
//         INSERT INTO vendor_products
//           (product_id, vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number)
//         VALUES (?,?,?,?,?,?)
//       `;
//       const vpVals = [
//         prodId, vendor_id, purchase_price, purchase_date, quantity_purchased, invoice_number
//       ];

//       database.query(vpSql, vpVals, (err2, vpResult) => {
//         if (err2) return rej(err2);

//         // Insert serial numbers if provided
//         if (serial_numbers && Array.isArray(serial_numbers) && serial_numbers.length > 0) {
//           const snValues = serial_numbers.map(sn => [prodId, sn]);
//           const snSql = `INSERT INTO product_serial_numbers (product_id, serial_number) VALUES ?`;
//           database.query(snSql, [snValues], (err3) => {
//             if (err3) return rej(err3);
//             res({ prodResult, vpResult });
//           });
//         } else {
//           res({ prodResult, vpResult });
//         }
//       });
//     });
//   });
// };

// // ✅ Get All Vendor Products with serial numbers as array
// exports.getVendorProducts = () => {
//   return new Promise((res, rej) => {
//     const sql = `
//       SELECT 
//         p.*, 
//         vp.vendor_id, vp.purchase_price, vp.purchase_date, vp.quantity_purchased, vp.invoice_number,
//         sc.subvariant_name, sc.color,
//         GROUP_CONCAT(psn.serial_number) AS serial_numbers
//       FROM products p
//       JOIN vendor_products vp ON p.id = vp.product_id
//       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
//       LEFT JOIN product_serial_numbers psn ON p.id = psn.product_id
//       GROUP BY p.id
//       ORDER BY p.id DESC
//     `;
//     database.query(sql, (err, result) => {
//       if (err) return rej(err);

//       // Convert serial_numbers CSV string to array
//       const formatted = result.map(row => ({
//         ...row,
//         serial_numbers: row.serial_numbers ? row.serial_numbers.split(',') : []
//       }));

//       res(formatted);
//     });
//   });
// };

// // ✅ Get Vendor Product by ID with serial numbers
// exports.getVendorProductById = (id) => {
//   return new Promise((res, rej) => {
//     const sql = `
//       SELECT 
//         p.*, 
//         vp.vendor_id, vp.purchase_price, vp.purchase_date, vp.quantity_purchased, vp.invoice_number,
//         sc.subvariant_name, sc.color,
//         GROUP_CONCAT(psn.serial_number) AS serial_numbers
//       FROM products p
//       JOIN vendor_products vp ON p.id = vp.product_id
//       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
//       LEFT JOIN product_serial_numbers psn ON p.id = psn.product_id
//       WHERE p.id = ?
//       GROUP BY p.id
//     `;
//     database.query(sql, [id], (err, rows) => {
//       if (err) return rej(err);
//       if (rows.length === 0) return res(null);

//       const row = rows[0];
//       row.serial_numbers = row.serial_numbers ? row.serial_numbers.split(',') : [];
//       res(row);
//     });
//   });
// };

// // ✅ Update Vendor Product + serial numbers (replace all serial numbers)
// exports.updateVendorProduct = (id, prodData, vpData, serial_numbers) => {
//   return new Promise((res, rej) => {
//     const pFields = [], pVals = [];
//     for (const k in prodData) {
//       pFields.push(`${k} = ?`);
//       pVals.push(prodData[k]);
//     }

//     const pSql = `UPDATE products SET ${pFields.join(', ')} WHERE id = ?`;
//     pVals.push(id);

//     database.query(pSql, pVals, (err1) => {
//       if (err1) return rej(err1);

//       const vpFields = [], vpVals = [];
//       for (const k in vpData) {
//         vpFields.push(`${k} = ?`);
//         vpVals.push(vpData[k]);
//       }

//       const vpSql = `UPDATE vendor_products SET ${vpFields.join(', ')} WHERE product_id = ?`;
//       vpVals.push(id);

//       database.query(vpSql, vpVals, (err2, result) => {
//         if (err2) return rej(err2);

//         if (serial_numbers && Array.isArray(serial_numbers)) {
//           // Delete existing serial numbers for product
//           database.query('DELETE FROM product_serial_numbers WHERE product_id = ?', [id], (err3) => {
//             if (err3) return rej(err3);

//             if (serial_numbers.length === 0) return res(result);

//             // Insert new serial numbers
//             const snValues = serial_numbers.map(sn => [id, sn]);
//             const snSql = `INSERT INTO product_serial_numbers (product_id, serial_number) VALUES ?`;
//             database.query(snSql, [snValues], (err4) => {
//               if (err4) return rej(err4);
//               res(result);
//             });
//           });
//         } else {
//           res(result);
//         }
//       });
//     });
//   });
// };

// // ✅ Delete Vendor Product (serial numbers will auto-delete due to foreign key cascade)
// exports.deleteVendorProduct = (id) => {
//   return new Promise((res, rej) => {
//     database.query('DELETE FROM vendor_products WHERE product_id = ?', [id], (e1) => {
//       if (e1) return rej(e1);
//       database.query('DELETE FROM products WHERE id = ?', [id], (e2, result) => e2 ? rej(e2) : res(result));
//     });
//   });
// };

// const database = require('../config/database');

// // 🔹 Add Vendor Product
// exports.add = (data) => {
//   return new Promise((resolve, reject) => {
//     const {
//       productname, hsncode, itemcode, price, discount,
//       gst, igst, cgst, sgst,
//       category_id, subcategory_id, vendor_id
//     } = data;

//     const sql = `
//       INSERT INTO addvendorproducts 
//       (productname, hsncode, itemcode, price, discount, gst, igst, cgst, sgst, category_id, subcategory_id, vendor_id)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       productname, hsncode, itemcode, price, discount,
//       gst, igst, cgst, sgst,
//       category_id || null, subcategory_id || null, vendor_id || null
//     ];

//     database.query(sql, values, (err, result) => {
//       if (err) return reject(err);
//       resolve({ id: result.insertId });
//     });
//   });
// };

// // 🔹 Get All Products
// exports.getAll = () => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT p.*, c.name AS category_name, sc.subvariant_name AS subcategory_name
//       FROM addvendorproducts p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
//       ORDER BY p.id DESC
//     `;
//     database.query(sql, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };

// // 🔹 Get by ID
// exports.getById = (id) => {
//   return new Promise((resolve, reject) => {
//     database.query('SELECT * FROM addvendorproducts WHERE id = ?', [id], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0] || null);
//     });
//   });
// };

// // 🔹 Update by ID
// exports.update = (id, data) => {
//   return new Promise((resolve, reject) => {
//     const {
//       productname, hsncode, itemcode, price, discount,
//       gst, igst, cgst, sgst,
//       category_id, subcategory_id, vendor_id
//     } = data;

//     const sql = `
//       UPDATE addvendorproducts SET
//         productname = ?, hsncode = ?, itemcode = ?, price = ?, discount = ?,
//         gst = ?, igst = ?, cgst = ?, sgst = ?,
//         category_id = ?, subcategory_id = ?, vendor_id = ?
//       WHERE id = ?
//     `;
//     const values = [
//       productname, hsncode, itemcode, price, discount,
//       gst, igst, cgst, sgst,
//       category_id || null, subcategory_id || null, vendor_id || null,
//       id
//     ];

//     database.query(sql, values, (err) => {
//       if (err) return reject(err);
//       resolve({ message: "Updated successfully" });
//     });
//   });
// };

// // 🔹 Delete by ID
// exports.remove = (id) => {
//   return new Promise((resolve, reject) => {
//     database.query('DELETE FROM addvendorproducts WHERE id = ?', [id], (err) => {
//       if (err) return reject(err);
//       resolve({ message: "Deleted successfully" });
//     });
//   });
// };

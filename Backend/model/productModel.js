const database = require('../config/database'); // Use your DB connection file

// ✅ Add simple product
exports.addSimpleProduct = (data) => {
  const {
    productname, hsncode, qntyyy, price, itemcode,
    discount, cgst, sgst, igst, category_id, warehouse_id
  } = data;

  const sql = `
    INSERT INTO products 
    (productname, hsncode, qntyyy, price, itemcode, discount, cgst, sgst, igst, category_id, warehouse_id, is_vendor_product)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)
  `;

  return new Promise((resolve, reject) => {
    database.query(sql, [
      productname, hsncode, qntyyy, price, itemcode,
      discount, cgst, sgst, igst, category_id, warehouse_id
    ], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// // ✅ Get all products
// exports.getAllProducts = () => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT p.*, c.name as category_name 
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       ORDER BY p.id DESC
//     `;
//     database.query(sql, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };
exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.id DESC
    `;
    database.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// ✅ Get product by ID
exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    database.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

// model method me changes karo
const allowedFields = [
  "productname",
  "itemcode",
  "hsncode",
  "qntyyy",
  "price",
  "discount",
  "cgst",
  "sgst",
  "igst",
  "category_id",
  "warehouse_id",
  "is_vendor_product"
];

exports.updateProductById = (id, data) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    for (const key in data) {
      if (!allowedFields.includes(key)) continue;  // sirf allowed fields hi update karo
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (fields.length === 0) {
      return reject(new Error("No valid fields to update"));
    }

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    database.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// ✅ Delete product
// ✅ Soft delete product by setting deleted_at timestamp
exports.deleteProductById = (productId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE products SET deleted_at = NOW() WHERE id = ?";
    database.query(sql, [productId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



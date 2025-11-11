


// const database = require('../config/database'); // ✅ Correctly imported

// exports.createInvoice = (invoiceData, callback) => {
//   const {
//     invoice_number, customer_id, invoice_date,
//     total_amount, total_discount, grand_total,
//     bill_to_address, ship_to_address, items
//   } = invoiceData;

//   const total_cgst = items.reduce((sum, item) => sum + Number(item.cgst || 0), 0);
//   const total_sgst = items.reduce((sum, item) => sum + Number(item.sgst || 0), 0);
//   const total_igst = items.reduce((sum, item) => sum + Number(item.igst || 0), 0);

//   const invoiceSQL = `
//     INSERT INTO invoices 
//     (invoice_number, customer_id, invoice_date, total_amount, total_discount, total_cgst, total_sgst, total_igst, grand_total, bill_to_address, ship_to_address)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     invoice_number, customer_id, invoice_date,
//     total_amount, total_discount, total_cgst,
//     total_sgst, total_igst, grand_total,
//     bill_to_address, ship_to_address
//   ];

//   database.query(invoiceSQL, values, (err, result) => {
//     if (err) return callback(err);

//     const invoiceId = result.insertId;
//     const itemSQL = `
//       INSERT INTO invoice_items
//       (invoice_id, product_id, quantity, selling_price, discount, cgst, sgst, igst, total_amount)
//       VALUES ?
//     `;

//     const itemValues = items.map(item => [
//       invoiceId,
//       item.product_id,
//       item.grand_total,
//       item.quantity,
//       item.selling_price,
//       item.discount,
//       item.cgst,
//       item.sgst,
//       item.igst,
//       item.total_amount
//     ]);

//     database.query(itemSQL, [itemValues], (itemErr) => {
//       if (itemErr) return callback(itemErr);
//       callback(null, { invoice_id: invoiceId });
//     });
//   });
// };


// exports.getAllInvoices = callback => {
//   const sql = `SELECT * FROM invoices ORDER BY id DESC`;
//   database.query(sql, (err, results) => {
//     if (err) return callback(err);

//     // Convert string/null numeric fields to numbers (or 0 if null)
//     const fixedResults = results.map(inv => ({
//       ...inv,
//       grand_total: inv.grand_total !== null ? Number(inv.grand_total) : 0,
//       total_amount: inv.total_amount !== null ? Number(inv.total_amount) : 0,
//       total_discount: inv.total_discount !== null ? Number(inv.total_discount) : 0,
//       total_cgst: inv.total_cgst !== null ? Number(inv.total_cgst) : 0,
//       total_sgst: inv.total_sgst !== null ? Number(inv.total_sgst) : 0,
//       total_igst: inv.total_igst !== null ? Number(inv.total_igst) : 0,
//     }));

//     callback(null, fixedResults);
//   });
// };

// exports.getInvoiceById = (id, callback) => {
//   const sql = `SELECT * FROM invoices WHERE id = ?`;
//   database.query(sql, [id], (err, invoiceResult) => {
//     if (err) return callback(err);
//     if (invoiceResult.length === 0) return callback(null, null);

//     const inv = invoiceResult[0];
//     const fixedInvoice = {
//       ...inv,
//       grand_total: inv.grand_total !== null ? Number(inv.grand_total) : 0,
//       total_amount: inv.total_amount !== null ? Number(inv.total_amount) : 0,
//       total_discount: inv.total_discount !== null ? Number(inv.total_discount) : 0,
//       total_cgst: inv.total_cgst !== null ? Number(inv.total_cgst) : 0,
//       total_sgst: inv.total_sgst !== null ? Number(inv.total_sgst) : 0,
//       total_igst: inv.total_igst !== null ? Number(inv.total_igst) : 0,
//     };

//     const itemsSQL = `SELECT * FROM invoice_items WHERE invoice_id = ?`;
//     database.query(itemsSQL, [id], (itemErr, itemResult) => {
//       if (itemErr) return callback(itemErr);
//       callback(null, { invoice: fixedInvoice, items: itemResult });
//     });
//   });
// };

// exports.deleteInvoice = (id, callback) => {
//   const sql = `DELETE FROM invoices WHERE id = ?`;
//   database.query(sql, [id], callback);
// };



// const database = require('../config/database'); // apni DB connection file

// exports.createInvoice = (data) => {
//   return new Promise((resolve, reject) => {
//     const {
//       customer_id,
//       invoice_date,    // optional, agar nahi mile to CURRENT_TIMESTAMP lagega DB me
//       total_amount,
//       items           // array of { product_id, quantity, price, discount, cgst, sgst, igst }
//     } = data;

//     if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
//       return reject(new Error("Customer ID and invoice items are required"));
//     }

//     database.getConnection((err, conn) => {
//       if (err) return reject(err);

//       conn.beginTransaction(err => {
//         if (err) {
//           conn.release();
//           return reject(err);
//         }

//         // Step 1: Insert invoice
//         const invoiceSql = `
//           INSERT INTO invoices (customer_id, invoice_date, total_amount)
//           VALUES (?, ?, ?)
//         `;

//         conn.query(invoiceSql, [customer_id, invoice_date || new Date(), total_amount], (err, invoiceResult) => {
//           if (err) {
//             return conn.rollback(() => {
//               conn.release();
//               reject(err);
//             });
//           }

//           const invoice_id = invoiceResult.insertId;

//           // Step 2: Insert invoice items one by one (sequentially)
//           let insertCount = 0;

//           function insertItem(i) {
//             if (i >= items.length) {
//               // All inserted, commit now
//               return conn.commit(err => {
//                 if (err) {
//                   return conn.rollback(() => {
//                     conn.release();
//                     reject(err);
//                   });
//                 }
//                 conn.release();
//                 resolve({ invoice_id, message: "Invoice created successfully" });
//               });
//             }

//             const item = items[i];
//             const {
//               product_id,
//               quantity,
//               price,
//               discount = 0,
//               cgst = 0,
//               sgst = 0,
//               igst = 0
//             } = item;

//             const itemSql = `
//               INSERT INTO invoice_items
//               (invoice_id, product_id, quantity, price, discount, cgst, sgst, igst)
//               VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//             `;

//             conn.query(itemSql, [invoice_id, product_id, quantity, price, discount, cgst, sgst, igst], (err) => {
//               if (err) {
//                 return conn.rollback(() => {
//                   conn.release();
//                   reject(err);
//                 });
//               }
//               insertItem(i + 1);
//             });
//           }

//           insertItem(0);
//         });
//       });
//     });
//   });
// };




// // ✅ Create Invoice (already shared above, skip here)

// // ✅ Get All Invoices with items
// exports.getAllInvoices = () => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       SELECT i.*, c.name as customer_name
//       FROM invoices i
//       LEFT JOIN customers c ON i.customer_id = c.id
//       ORDER BY i.id DESC
//     `;

//     database.query(sql, (err, invoices) => {
//       if (err) return reject(err);

//       if (invoices.length === 0) return resolve([]);

//       const invoiceIds = invoices.map(i => i.id);
//       const itemSql = `
//         SELECT ii.*, p.productname
//         FROM invoice_items ii
//         LEFT JOIN addvendorproducts p ON ii.product_id = p.id
//         WHERE ii.invoice_id IN (?)
//       `;

//       database.query(itemSql, [invoiceIds], (err2, items) => {
//         if (err2) return reject(err2);

//         // Group items by invoice_id
//         const itemMap = {};
//         items.forEach(item => {
//           if (!itemMap[item.invoice_id]) itemMap[item.invoice_id] = [];
//           itemMap[item.invoice_id].push(item);
//         });

//         // Merge items into invoice
//         const result = invoices.map(inv => ({
//           ...inv,
//           items: itemMap[inv.id] || []
//         }));

//         resolve(result);
//       });
//     });
//   });
// };




// exports.getInvoiceById = (id) => {
//     return new Promise((resolve, reject) => {
//       const sql = `
//         SELECT i.*, c.name as customer_name
//         FROM invoices i
//         LEFT JOIN customers c ON i.customer_id = c.id
//         WHERE i.id = ?
//       `;
//       database.query(sql, [id], (err, invoiceRows) => {
//         if (err) return reject(err);
//         if (invoiceRows.length === 0) return resolve(null);
  
//         const invoice = invoiceRows[0];
  
//         const itemSql = `
//           SELECT ii.*, p.productname
//           FROM invoice_items ii
//           LEFT JOIN addvendorproducts p ON ii.product_id = p.id
//           WHERE ii.invoice_id = ?
//         `;
  
//         database.query(itemSql, [id], (err2, items) => {
//           if (err2) return reject(err2);
  
//           resolve({
//             ...invoice,
//             items: items || []
//           });
//         });
//       });
//     });
//   };
  


const database = require('../config/database');

// 🔹 Create Invoice with Items (no getConnection, no release)
exports.createInvoice = (data) => {
  return new Promise((resolve, reject) => {
    const { customer_id, invoice_date, total_amount, items } = data;

    database.beginTransaction(err => {
      if (err) return reject(err);

      const invoiceSql = `
        INSERT INTO invoices (customer_id, invoice_date, total_amount)
        VALUES (?, ?, ?)
      `;
      const invoiceVals = [customer_id, invoice_date, total_amount];

      database.query(invoiceSql, invoiceVals, (err1, invoiceResult) => {
        if (err1) {
          return database.rollback(() => reject(err1));
        }

        const invoiceId = invoiceResult.insertId;

        if (!items || items.length === 0) {
          return database.commit(err => {
            if (err) return database.rollback(() => reject(err));
            resolve({ invoice_id: invoiceId });
          });
        }

        const itemSql = `
          INSERT INTO invoice_items
          (invoice_id, product_id, quantity, price, discount, cgst, sgst, igst)
          VALUES ?
        `;

        const itemValues = items.map(i => [
          invoiceId, i.product_id, i.quantity, i.price, i.discount || 0, i.cgst || 0, i.sgst || 0, i.igst || 0
        ]);

        database.query(itemSql, [itemValues], (err2) => {
          if (err2) {
            return database.rollback(() => reject(err2));
          }

          database.commit(err3 => {
            if (err3) return database.rollback(() => reject(err3));
            resolve({ invoice_id: invoiceId });
          });
        });
      });
    });
  });
};



// 🔹 Get All Invoices with Items
exports.getAllInvoices = () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT i.*, c.customer_name AS customer_name
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        ORDER BY i.id DESC
      `;
  
      database.query(sql, (err, invoices) => {
        if (err) return reject(err);
        if (invoices.length === 0) return resolve([]);
  
        const ids = invoices.map(i => i.id);
        const itemSql = `
          SELECT ii.*, p.productname
          FROM invoice_items ii
          LEFT JOIN addvendorproducts p ON ii.product_id = p.id
          WHERE ii.invoice_id IN (?)
        `;
  
        database.query(itemSql, [ids], (err2, items) => {
          if (err2) return reject(err2);
  
          const groupedItems = {};
          items.forEach(item => {
            if (!groupedItems[item.invoice_id]) groupedItems[item.invoice_id] = [];
            groupedItems[item.invoice_id].push(item);
          });
  
          const result = invoices.map(inv => ({
            ...inv,
            items: groupedItems[inv.id] || []
          }));
  
          resolve(result);
        });
      });
    });
  };
// 🔹 Get Invoice by ID
exports.getInvoiceById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT i.*, c.customer_name AS customer_name
        FROM invoices i
        LEFT JOIN customers c ON i.customer_id = c.id
        WHERE i.id = ?
      `;
      database.query(sql, [id], (err, invoiceRows) => {
        if (err) return reject(err);
        if (invoiceRows.length === 0) return resolve(null);
  
        const invoice = invoiceRows[0];
  
        const itemSql = `
          SELECT ii.*, p.productname
          FROM invoice_items ii
          LEFT JOIN addvendorproducts p ON ii.product_id = p.id
          WHERE ii.invoice_id = ?
        `;
  
        database.query(itemSql, [id], (err2, items) => {
          if (err2) return reject(err2);
          resolve({ ...invoice, items: items || [] });
        });
      });
    });
  };
  
  // 🔹 Update Invoice (replace items)
  exports.updateInvoice = (id, data) => {
    return new Promise((resolve, reject) => {
      const { customer_id, invoice_date, total_amount, items } = data;
  
      database.beginTransaction(err => {
        if (err) return reject(err);
  
        const updateSql = `
          UPDATE invoices
          SET customer_id = ?, invoice_date = ?, total_amount = ?
          WHERE id = ?
        `;
  
        database.query(updateSql, [customer_id, invoice_date, total_amount, id], (err1) => {
          if (err1) return database.rollback(() => reject(err1));
  
          database.query(`DELETE FROM invoice_items WHERE invoice_id = ?`, [id], (err2) => {
            if (err2) return database.rollback(() => reject(err2));
  
            if (!items || items.length === 0) {
              return database.commit(err => {
                if (err) return database.rollback(() => reject(err));
                resolve({ message: "Invoice updated without items" });
              });
            }
  
            const itemSql = `
              INSERT INTO invoice_items
              (invoice_id, product_id, quantity, price, discount, cgst, sgst, igst)
              VALUES ?
            `;
  
            const itemVals = items.map(i => [
              id, i.product_id, i.quantity, i.price, i.discount || 0, i.cgst || 0, i.sgst || 0, i.igst || 0
            ]);
  
            database.query(itemSql, [itemVals], (err3) => {
              if (err3) return database.rollback(() => reject(err3));
  
              database.commit(err4 => {
                if (err4) return database.rollback(() => reject(err4));
                resolve({ message: "Invoice updated successfully" });
              });
            });
          });
        });
      });
    });
  };
  
  // 🔹 Delete Invoice
  exports.deleteInvoice = (id) => {
    return new Promise((resolve, reject) => {
      database.query('DELETE FROM invoice_items WHERE invoice_id = ?', [id], (err1) => {
        if (err1) return reject(err1);
        database.query('DELETE FROM invoices WHERE id = ?', [id], (err2) => {
          if (err2) return reject(err2);
          resolve({ message: "Invoice deleted successfully" });
        });
      });
    });
  };
  
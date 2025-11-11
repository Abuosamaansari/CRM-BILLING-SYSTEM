const database = require('../config/database');

exports.createPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO payments 
      (invoice_id, vendor_id, customer_id, payment_date, payment_mode, amount, status, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      paymentData.invoice_id,
      paymentData.vendor_id,
      paymentData.customer_id,
      paymentData.payment_date,
      paymentData.payment_mode,
      paymentData.amount,
      paymentData.status,
      paymentData.remarks
    ];

    database.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};




exports.getAllPayments = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM payments ORDER BY payment_date DESC`;
    database.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};




exports.getPaymentById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM payments WHERE id = ?`;
    database.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};





exports.updatePayment = (id, paymentData) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE payments SET 
        invoice_id = ?, 
        vendor_id = ?, 
        customer_id = ?, 
        payment_date = ?, 
        payment_mode = ?, 
        amount = ?, 
        status = ?, 
        remarks = ?
      WHERE id = ?
    `;
    const values = [
      paymentData.invoice_id,
      paymentData.vendor_id,
      paymentData.customer_id,
      paymentData.payment_date,
      paymentData.payment_mode,
      paymentData.amount,
      paymentData.status,
      paymentData.remarks,
      id
    ];
    database.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};






exports.deletePayment = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM payments WHERE id = ?`;
    database.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};






















// models/customerModel.js
const database = require('../config/database');

exports.insertCustomer = (customerData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO customers (
        customer_name, phone_number, email, gst_number,
        address_1, pin_code_1, state_name_1, state_gst_code_1,
        address_2, pin_code_2, state_name_2, state_gst_code_2,
        contact_person_1_name, contact_person_1_number,
        contact_person_2_name, contact_person_2_number,
        account_holder_1_name, bank_name_1, account_number_1, ifsc_code_1,
        account_holder_2_name, bank_name_2, account_number_2, ifsc_code_2,
        pan_number, msme_number, cin_number, terms_and_conditions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      customerData.customer_name,
      customerData.phone_number,
      customerData.email,
      customerData.gst_number,
      customerData.address_1,
      customerData.pin_code_1,
      customerData.state_name_1,
      customerData.state_gst_code_1,
      customerData.address_2,
      customerData.pin_code_2,
      customerData.state_name_2,
      customerData.state_gst_code_2,
      customerData.contact_person_1_name,
      customerData.contact_person_1_number,
      customerData.contact_person_2_name,
      customerData.contact_person_2_number,
      customerData.account_holder_1_name,
      customerData.bank_name_1,
      customerData.account_number_1,
      customerData.ifsc_code_1,
      customerData.account_holder_2_name,
      customerData.bank_name_2,
      customerData.account_number_2,
      customerData.ifsc_code_2,
      customerData.pan_number,
      customerData.msme_number,
      customerData.cin_number,
      customerData.terms_and_conditions
    ];

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getAllCustomers = () => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM customers`, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.getCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM customers WHERE id = ?`, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

exports.deleteCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM customers WHERE id = ?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.updateCustomerById = (id, customerData) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    for (const key in customerData) {
      fields.push(`${key} = ?`);
      values.push(customerData[key]);
    }

    const query = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

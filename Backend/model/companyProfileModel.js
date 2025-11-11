// models/companyProfileModel.js
const database = require('../config/database');

const CompanyProfile = {
  getProfile: (callback) => {
    database.query('SELECT * FROM company_profile LIMIT 1', callback);
  },

  createProfile: (data, callback) => {
    database.query('INSERT INTO company_profile SET ?', data, callback);
  },

  checkIfExists: (callback) => {
    database.query('SELECT COUNT(*) AS count FROM company_profile', callback);
  },

  updateProfile: (id, data, callback) => {
    database.query('UPDATE company_profile SET ? WHERE id = ?', [data, id], callback);
  },

  deleteProfile: (id, callback) => {
    database.query('DELETE FROM company_profile WHERE id = ?', [id], callback);
  },

  incrementInvoiceNumber: (id, callback) => {
    database.query('UPDATE company_profile SET current_invoice_number = current_invoice_number + 1 WHERE id = ?', [id], callback);
  }
};

module.exports = CompanyProfile;

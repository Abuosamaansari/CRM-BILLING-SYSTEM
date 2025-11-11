const database = require('../config/database');

exports.insertCompany = (companyData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO companies (
        name, registration_number, address, city, state,
        country, postal_code, email, phone, website,
        logo_url, industry_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      companyData.name,
      companyData.registration_number,
      companyData.address,
      companyData.city,
      companyData.state,
      companyData.country,
      companyData.postal_code,
      companyData.email,
      companyData.phone,
      companyData.website,
      companyData.logo_url,
      companyData.industry_type
    ];

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getAllCompanies = () => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM companies`, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.getCompanyById = (id) => {
  return new Promise((resolve, reject) => {
    database.query(`SELECT * FROM companies WHERE id = ?`, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

exports.deleteCompanyById = (id) => {
  return new Promise((resolve, reject) => {
    database.query(`DELETE FROM companies WHERE id = ?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.updateCompanyById = (id, companyData) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    // Dynamically create update fields and values
    for (const key in companyData) {
      fields.push(`${key} = ?`);
      values.push(companyData[key]);
    }

    const query = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

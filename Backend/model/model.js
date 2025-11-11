// models/vendorModel.js
const database = require('../config/database');

exports.insertVendor = (vendorData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO vendors (
        vendorename, pan_number, landline, contact_person_name, contact_person_number,
        description, email, phone_number, website, business_type,
        bank_name, bank_account_number, bank_ifsc,
        address_line1, address_line2, city, state, postal_code, country,
        date_of_registration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      vendorData.vendorename,
      vendorData.pan_number,
      vendorData.landline,
      vendorData.contact_person_name,
      vendorData.contact_person_number,
      vendorData.description,
      vendorData.email,
      vendorData.phone_number,
      vendorData.website,
      vendorData.business_type,
      vendorData.bank_name,
      vendorData.bank_account_number,
      vendorData.bank_ifsc,
      vendorData.address.line1,
      vendorData.address.line2,
      vendorData.address.city,
      vendorData.address.state,
      vendorData.address.postal_code,
      vendorData.address.country,
      vendorData.date_of_registration,
    ];

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



exports.getAllVendors = (filters = {}) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM vendors WHERE 1=1`;
    const values = [];

    // Optional filters
    if (filters.vendorename) {
      query += ` AND vendorename LIKE ?`;
      values.push(`%${filters.vendorename}%`);
    }

    if (filters.email) {
      query += ` AND email = ?`;
      values.push(filters.email);
    }

    if (filters.city) {
      query += ` AND city = ?`;
      values.push(filters.city);
    }

    database.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// models/vendorModel.js
exports.getVendorById = (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM vendors WHERE id = ?`;
  
      database.query(query, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]); // Only one vendor
      });
    });
  };
  


  // models/vendorModel.js
// exports.updateVendorById = (id, vendorData) => {
//     return new Promise((resolve, reject) => {
//       const fields = [];
//       const values = [];
  
//       // Dynamically build query
//       for (const key in vendorData) {
//         if (typeof vendorData[key] === 'object' && vendorData[key] !== null) {
//           for (const subKey in vendorData[key]) {
//             fields.push(`${key}_${subKey} = ?`);
//             values.push(vendorData[key][subKey]);
//           }
//         } else {
//           fields.push(`${key} = ?`);
//           values.push(vendorData[key]);
//         }
//       }
  
//       const query = `UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`;
//       values.push(id);
  
//       database.query(query, values, (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       });
//     });
//   };
  


exports.updateVendorById = (id, vendorData) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    for (const key in vendorData) {
      if (typeof vendorData[key] === "object" && vendorData[key] !== null) {
        // Handle address object explicitly
        if (key === "address") {
          const addressMap = {
            line1: "address_line1",
            line2: "address_line2",
            city: "city",
            state: "state",
            postal_code: "postal_code",
            country: "country",
          };

          for (const subKey in vendorData[key]) {
            if (addressMap[subKey]) {
              fields.push(`${addressMap[subKey]} = ?`);
              values.push(vendorData[key][subKey]);
            }
          }
        } else {
          // For other nested objects, fallback to flat key_subKey (if any)
          for (const subKey in vendorData[key]) {
            fields.push(`${key}_${subKey} = ?`);
            values.push(vendorData[key][subKey]);
          }
        }
      } else {
        fields.push(`${key} = ?`);
        values.push(vendorData[key]);
      }
    }

    const query = `UPDATE vendors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    database.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};




  exports.deleteVendorById = async (id) => {
    const [result] = await database.promise().query(`DELETE FROM vendors WHERE id = ?`, [id]);
    return result;
  };
  


 
 



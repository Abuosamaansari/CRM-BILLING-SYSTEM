require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../config/database"); 

exports.getprofile = (req, res) => {
    try {
      const user_id = req.id;  
      if (!user_id) {
        return res.status(400).json({ error: 'User ID not found' });
      }
  
      const sql = `SELECT * FROM company_profile WHERE user_id = ? LIMIT 1`;
      const [results] =  database.query(sql, [user_id]);
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Company profile not found for this user' });
      }
  
      res.json(results[0]);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.createProfile = (req, res) => {
    try {
      const {
        company_name,
        address_1,
        pin_code_1,
        state_name_1,
        state_gst_code_1,
        address_2,
        pin_code_2,
        state_name_2,
        state_gst_code_2,
        contact_person_1_name,
        contact_person_1_number,
        contact_person_2_name,
        contact_person_2_number,
        account_holder_1_name,
        bank_name_1,
        account_number_1,
        ifsc_code_1,
        account_holder_2_name,
        bank_name_2,
        account_number_2,
        ifsc_code_2,
        gst_number,
        pan_number,
        msme_number,
        cin_number,
        email,
        terms_and_conditions,
        invoice_prefix,
        invoice_start_number,
        current_invoice_number,
      } = req.body;
  
      const user_id = req.id;  
  
      const sql = `
        INSERT INTO company_profile (
          company_name, address_1, pin_code_1, state_name_1, state_gst_code_1,
          address_2, pin_code_2, state_name_2, state_gst_code_2,
          contact_person_1_name, contact_person_1_number, contact_person_2_name, contact_person_2_number,
          account_holder_1_name, bank_name_1, account_number_1, ifsc_code_1,
          account_holder_2_name, bank_name_2, account_number_2, ifsc_code_2,
          gst_number, pan_number, msme_number, cin_number,
          email, terms_and_conditions, invoice_prefix, invoice_start_number,
          current_invoice_number, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        company_name, address_1, pin_code_1, state_name_1, state_gst_code_1,
        address_2, pin_code_2, state_name_2, state_gst_code_2,
        contact_person_1_name, contact_person_1_number, contact_person_2_name, contact_person_2_number,
        account_holder_1_name, bank_name_1, account_number_1, ifsc_code_1,
        account_holder_2_name, bank_name_2, account_number_2, ifsc_code_2,
        gst_number, pan_number, msme_number, cin_number,
        email, terms_and_conditions, invoice_prefix, invoice_start_number,
        current_invoice_number, user_id,
      ];
  
      database.query(sql, values);
      res.status(201).json({ message: 'Company profile created successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the company profile' });
    }
  };
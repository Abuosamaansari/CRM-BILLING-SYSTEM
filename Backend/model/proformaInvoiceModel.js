const database = require('../config/database');

exports.createProformaInvoice = (invoiceData, items, callback) => {
  database.beginTransaction(err => {
    if (err) return callback(err);

    const insertInvoiceSql = `
      INSERT INTO proforma_invoices
      (customer_id, invoice_number, invoice_date, total_amount, status, remarks)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const invoiceVals = [
      invoiceData.customer_id,
      invoiceData.invoice_number,
      invoiceData.invoice_date,
      invoiceData.total_amount,
      invoiceData.status || 'Pending',
      invoiceData.remarks || null
    ];

    database.query(insertInvoiceSql, invoiceVals, (err, result) => {
      if (err) return database.rollback(() => callback(err));

      const invoiceId = result.insertId;
      const insertItemsSql = `
        INSERT INTO proforma_invoice_items
        (proforma_invoice_id, product_id, quantity, price, discount, cgst, sgst, igst)
        VALUES ?
      `;

      const itemVals = items.map(i => [
        invoiceId, i.product_id, i.quantity, i.price,
        i.discount || 0, i.cgst || 0, i.sgst || 0, i.igst || 0
      ]);

      database.query(insertItemsSql, [itemVals], (err) => {
        if (err) return database.rollback(() => callback(err));

        database.commit(err => {
          if (err) return database.rollback(() => callback(err));
          callback(null, { id: invoiceId });
        });
      });
    });
  });
};

exports.getAllProformaInvoices = (callback) => {
  const sql = `SELECT * FROM proforma_invoices ORDER BY created_at DESC`;
  database.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

exports.getProformaInvoiceById = (id, callback) => {
  const invoiceSql = `SELECT * FROM proforma_invoices WHERE id = ?`;
  const itemsSql = `SELECT * FROM proforma_invoice_items WHERE proforma_invoice_id = ?`;

  database.query(invoiceSql, [id], (err, invoiceResults) => {
    if (err) return callback(err);
    if (invoiceResults.length === 0) return callback(null, null);

    database.query(itemsSql, [id], (err, itemResults) => {
      if (err) return callback(err);
      callback(null, { invoice: invoiceResults[0], items: itemResults });
    });
  });
};

exports.updateProformaInvoice = (id, invoiceData, items, callback) => {
  database.beginTransaction(err => {
    if (err) return callback(err);

    const updateInvoiceSql = `
      UPDATE proforma_invoices
      SET customer_id=?, invoice_number=?, invoice_date=?, total_amount=?, status=?, remarks=?
      WHERE id = ?
    `;
    const invoiceVals = [
      invoiceData.customer_id,
      invoiceData.invoice_number,
      invoiceData.invoice_date,
      invoiceData.total_amount,
      invoiceData.status || 'Pending',
      invoiceData.remarks || null,
      id
    ];

    database.query(updateInvoiceSql, invoiceVals, (err) => {
      if (err) return database.rollback(() => callback(err));

      // Delete old items then insert new
      database.query(`DELETE FROM proforma_invoice_items WHERE proforma_invoice_id = ?`, [id], (err) => {
        if (err) return database.rollback(() => callback(err));

        const insertItemsSql = `
          INSERT INTO proforma_invoice_items
          (proforma_invoice_id, product_id, quantity, price, discount, cgst, sgst, igst)
          VALUES ?
        `;

        const itemVals = items.map(i => [
          id, i.product_id, i.quantity, i.price,
          i.discount || 0, i.cgst || 0, i.sgst || 0, i.igst || 0
        ]);

        database.query(insertItemsSql, [itemVals], (err) => {
          if (err) return database.rollback(() => callback(err));

          database.commit(err => {
            if (err) return database.rollback(() => callback(err));
            callback(null, { id });
          });
        });
      });
    });
  });
};

exports.deleteProformaInvoice = (id, callback) => {
  database.beginTransaction(err => {
    if (err) return callback(err);

    // Deleting invoice will also delete items due to foreign key ON DELETE CASCADE
    database.query(`DELETE FROM proforma_invoices WHERE id = ?`, [id], (err, result) => {
      if (err) return database.rollback(() => callback(err));
      database.commit(err => {
        if (err) return database.rollback(() => callback(err));
        callback(null, result);
      });
    });
  });
};

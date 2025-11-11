const database = require('../config/database');

exports.createPO = (poData, items) => {
  return new Promise((resolve, reject) => {
    database.beginTransaction(err => {
      if (err) return reject(err);

      const poSql = `
        INSERT INTO purchase_orders (vendor_id, po_number, order_date, status, remarks)
        VALUES (?, ?, ?, ?, ?)
      `;
      const poValues = [
        poData.vendor_id,
        poData.po_number,
        poData.order_date,
        poData.status || 'Draft',
        poData.remarks || ''
      ];

      database.query(poSql, poValues, (err, result) => {
        if (err) return database.rollback(() => reject(err));

        const poId = result.insertId;

        const itemSql = `
          INSERT INTO purchase_order_items (po_id, product_id, quantity, purchase_price)
          VALUES ?
        `;
        const itemValues = items.map(item => [
          poId, item.product_id, item.quantity, item.purchase_price
        ]);

        database.query(itemSql, [itemValues], (err2) => {
          if (err2) return database.rollback(() => reject(err2));

          database.commit(err3 => {
            if (err3) return database.rollback(() => reject(err3));
            resolve({ po_id: poId });
          });
        });
      });
    });
  });
};

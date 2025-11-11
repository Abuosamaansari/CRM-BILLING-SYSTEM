const database = require('../config/database');

exports.receiveGoods = (po_id, items, grnData) => {
  return new Promise((resolve, reject) => {
    database.beginTransaction(err => {
      if (err) return reject(err);

      const grnSql = `INSERT INTO grns (po_id, received_date, remarks) VALUES (?, ?, ?)`;
      const grnVals = [po_id, grnData.received_date, grnData.remarks];

      database.query(grnSql, grnVals, (err, result) => {
        if (err) return database.rollback(() => reject(err));

        const grn_id = result.insertId;

        const itemSql = `
          INSERT INTO grn_items (grn_id, product_id, quantity_received) VALUES ?
        `;
        const itemValues = items.map(item => [
          grn_id, item.product_id, item.quantity_received
        ]);

        database.query(itemSql, [itemValues], (err2) => {
          if (err2) return database.rollback(() => reject(err2));

          // Update stock
          const stockUpdates = items.map(item => {
            return new Promise((res, rej) => {
                database.query(
                `UPDATE products SET qntyyy = qntyyy + ? WHERE id = ?`,
                [item.quantity_received, item.product_id],
                (err3) => {
                  if (err3) return rej(err3);
                  res();
                }
              );
            });
          });

          Promise.all(stockUpdates)
            .then(() => {
                database.query(
                `UPDATE purchase_orders SET status = 'Received' WHERE id = ?`,
                [po_id],
                (err4) => {
                  if (err4) return database.rollback(() => reject(err4));

                  database.commit(err5 => {
                    if (err5) return database.rollback(() => reject(err5));
                    resolve({ grn_id });
                  });
                }
              );
            })
            .catch(err => database.rollback(() => reject(err)));
        });
      });
    });
  });
};

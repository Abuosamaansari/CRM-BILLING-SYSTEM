const database = require('../config/database');

exports.getStockSummary = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id AS product_id,
        p.productname,
        p.itemcode,
        p.qntyyy,
        c.name AS category,
        w.name AS warehouse
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
    `;

    database.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

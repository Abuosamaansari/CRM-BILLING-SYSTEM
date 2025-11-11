const database = require('../config/database');

// Add or Update Category with Subcategories and Serial Numbers
exports.addOrUpdateCategory = (data) => {
  return new Promise((resolve, reject) => {
    const { category, subcategories } = data;
    const isNewCategory = !category.id;

    const catSql = isNewCategory
      ? "INSERT INTO categories (name, description) VALUES (?, ?)"
      : "UPDATE categories SET name = ?, description = ? WHERE id = ?";
    const catValues = isNewCategory
      ? [category.name, category.description]
      : [category.name, category.description, category.id];

    database.query(catSql, catValues, (err, result) => {
      if (err) return reject(err);
      const categoryId = isNewCategory ? result.insertId : category.id;

      // Handle subcategories insertion/updation
      const subTasks = subcategories.map(sub => {
        return new Promise((res, rej) => {
          const isNewSub = !sub.id;
          const subSql = isNewSub
            ? "INSERT INTO subcategories (category_id, subvariant_name, color) VALUES (?, ?, ?)"
            : "UPDATE subcategories SET subvariant_name = ?, color = ? WHERE id = ?";
          const subValues = isNewSub
            ? [categoryId, sub.subvariant_name, sub.color]
            : [sub.subvariant_name, sub.color, sub.id];

          database.query(subSql, subValues, (subErr, subResult) => {
            if (subErr) return rej(subErr);
            const subcategoryId = isNewSub ? subResult.insertId : sub.id;

            // Insert serial numbers if present
            const serials = sub.serial_numbers || [];
            if (serials.length === 0) return res();

            const serialSql = `
              INSERT INTO subcategory_serials (subcategory_id, serial_number)
              VALUES ${serials.map(() => '(?, ?)').join(', ')}
              ON DUPLICATE KEY UPDATE serial_number = serial_number
            `;
            const serialValues = serials.flatMap(sn => [subcategoryId, sn]);
            // Yahan console log karo debug ke liye
            console.log("Serials array:", serials);
            console.log("Values for SQL placeholders:", serialValues);
            console.log("Generated SQL query:", serialSql);

            database.query(serialSql, serialValues, (serialErr) => {
              if (serialErr) return rej(serialErr);
              res();
            });
          });
        });
      });

      // Wait for all subcategory and serial inserts/updates to finish
      Promise.all(subTasks)
        .then(() => resolve({ message: "Category saved successfully.", categoryId }))
        .catch(reject);
    });
  });
};

// Get all categories with their subcategories and serial numbers
exports.getAllCategories = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.id AS category_id, c.name AS category_name, c.description,
             sc.id AS sub_id, sc.subvariant_name, sc.color,
             ss.serial_number, ss.is_sold
      FROM categories c
      LEFT JOIN subcategories sc ON sc.category_id = c.id
      LEFT JOIN subcategory_serials ss ON ss.subcategory_id = sc.id
      ORDER BY c.id DESC, sc.id, ss.id
    `;

    database.query(sql, (err, rows) => {
      if (err) return reject(err);

      const categoriesMap = {};

      rows.forEach(row => {
        if (!categoriesMap[row.category_id]) {
          categoriesMap[row.category_id] = {
            id: row.category_id,
            name: row.category_name,
            description: row.description,
            subcategories: []
          };
        }

        if (row.sub_id) {
          let sub = categoriesMap[row.category_id].subcategories.find(s => s.id === row.sub_id);
          if (!sub) {
            sub = {
              id: row.sub_id,
              subvariant_name: row.subvariant_name,
              color: row.color,
              serial_numbers: []
            };
            categoriesMap[row.category_id].subcategories.push(sub);
          }
          if (row.serial_number) {
            sub.serial_numbers.push({
              serial_number: row.serial_number,
              is_sold: row.is_sold
            });
          }
        }
      });

      resolve(Object.values(categoriesMap));
    });
  });
};

// Delete category (and related subcategories and serials via cascading foreign keys)
exports.deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    database.query(
      "DELETE FROM categories WHERE id = ?",
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ message: "Category and related data deleted.", result });
      }
    );
  });
};




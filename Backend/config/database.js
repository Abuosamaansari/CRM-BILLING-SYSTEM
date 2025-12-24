 // db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'12345',
  database:'crm'
});
// Acstech@2025
// Connect to DB
connection.connect((err) => {
  if (err) {
    console.error('❌ DB connection failed');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    process.exit(1); // stop app if DB connection fails
  }
  console.log('✅ Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Arpico@123',  // Replace with your MySQL root password
  database: 'arpico_online'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err);
    return;
  }
  console.log('✅ MySQL Connected');
});

module.exports = db;

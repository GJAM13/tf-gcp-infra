const db = require('./db');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
  );
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
    process.exit(1);
  }
  console.log('Users table is ready');
  db.end();
});

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user:'root',
  password: process.env.DB_PASSWORD || 'rootpassword',  // Use the root password
});

connection.connect((err) => {
  if (err) {
    process.exit(1); // Exit the process with an error code
  }
});

module.exports = connection; // Export the connection

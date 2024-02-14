const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.post('/v1/user', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Error creating user', error: err });
      return;
    }
    res.status(201).send({ message: 'User created successfully', userId: result.insertId });
  });
});

app.put('/v1/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Error updating user', error: err });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    res.status(200).send({ message: 'User updated successfully' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing

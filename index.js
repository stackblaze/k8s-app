const express = require('express');
const { Client } = require('pg');

const app = express();

const port = process.env.PORT || 8000;
const databaseUrl = process.env.DATABASE_URL;

const client = new Client({
  connectionString: databaseUrl,
});

app.get('/', (req, res) => {
  client.connect()
    .then(() => console.log('Connected to PostgreSQL server'))
    .catch((err) => console.error('Error connecting to PostgreSQL server', err));

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL
    )
  `;
  client.query(createTableQuery)
    .then(() => console.log('Created table: users'))
    .catch((err) => console.error('Error creating table', err));

  const insertDataQuery = `
    INSERT INTO users (name, email, password)
    VALUES 
      ('John Doe', 'john.doe@example.com', '123456'),
      ('Jane Doe', 'jane.doe@example.com', 'password'),
      ('Bob Smith', 'bob.smith@example.com', 'secret')
  `;
  client.query(insertDataQuery)
    .then(() => console.log('Populated table with data'))
    .catch((err) => console.error('Error populating table with data', err));

  const selectDataQuery = `
    SELECT * FROM users LIMIT 3
  `;
  client.query(selectDataQuery)
    .then((result) => {
      console.log('Read data from table');
      res.send(result.rows);
    })
    .catch((err) => console.error('Error reading data from table', err))
    .finally(() => {
      client.end();
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
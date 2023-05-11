const express = require('express');
const { Client } = require('pg');

const app = express();

const port = process.env.PORT || 80;
const databaseUrl = process.env.DATABASE_URL;

function generateFakeData() {
  const fakeData = [];
  for (let i = 0; i < 10; i++) {
    const name = `User ${i + 1}`;
    const email = `user${i + 1}@example.com`;
    const password = `password${i + 1}`;
    fakeData.push([name, email, password]);
  }
  return fakeData;
}

app.get('/', (req, res) => {
  const client = new Client({
    connectionString: databaseUrl,
  });

  client.connect()
    .then(() => console.log('Connected to PostgreSQL server'))
    .catch((err) => console.error('Error connecting to PostgreSQL server', err));

  const checkTableQuery = `
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
  `;
  client.query(checkTableQuery)
    .then((result) => {
      const tableExists = result.rows[0].exists;
      if (!tableExists) {
        const createTableQuery = `
          CREATE TABLE users (
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
          VALUES ($1, $2, $3)
        `;
        const fakeData = generateFakeData();
        client.query(insertDataQuery, fakeData)
          .then(() => console.log('Populated table with fake data'))
          .catch((err) => console.error('Error populating table with fake data', err));
      } else {
        console.log('Table already exists. Skipping fake data generation.');
      }

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
    })
    .catch((err) => console.error('Error checking table existence', err));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const express = require('express');
const { Client } = require('pg');
// 28
const app = express();

const port = process.env.PORT || 80;
const databaseUrl = process.env.DATABASE_URL;

const client = new Client({
  connectionString: databaseUrl,
});

async function connectAndOperate() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    const checkTableQuery = `
      SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
    `;
    const tableCheckResult = await client.query(checkTableQuery);
    const tableExists = tableCheckResult.rows[0].exists;

    if (!tableExists) {
      const createTableQuery = `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          email VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(50) NOT NULL
        )
      `;
      await client.query(createTableQuery);
      console.log('Created table: users');

      const insertDataQuery = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
      `;
      const fakeData = generateFakeData();
      await client.query(insertDataQuery, fakeData);
      console.log('Populated table with fake data');
    } else {
      console.log('Table already exists. Skipping fake data generation.');
    }

    const selectDataQuery = `
      SELECT * FROM users LIMIT 3
    `;
    const selectResult = await client.query(selectDataQuery);
    console.log('Read data from table');
    return selectResult.rows;
  } catch (err) {
    console.error('Error performing database operations', err);
  }
}

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

app.get('/', async (req, res) => {
  const data = await connectAndOperate();
  res.send(data);
});

client.connect()
  .then(() => {
    console.log('PostgreSQL client connected');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL server', err);
  });

const { Pool } = require("pg");
const fs = require("fs").promises;
const path = require("path");

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function seed() {
  let client;
  try {
    // Read the SQL file
    const sqlFile = await fs.readFile(
      path.join(__dirname, "users.sql"),
      "utf8"
    );

    // Connect to the database
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");

    // Execute the SQL statements
    await client.query(sqlFile);

    // Commit transaction
    await client.query("COMMIT");

    console.log("Database seeded successfully");
  } catch (error) {
    // Rollback transaction in case of error
    if (client) await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
  } finally {
    // Release the client back to the pool
    if (client) client.release();
    // Close the pool
    await pool.end();
  }
}

// Run the seed function
seed();

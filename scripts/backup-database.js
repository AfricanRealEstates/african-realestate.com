const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const dbConfig = {
  host: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : undefined,
  port: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).port
    : "5432",
  database: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).pathname.slice(1)
    : undefined,
  user: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).username
    : undefined,
  password: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).password
    : undefined,
};

const backupDir = path.join(process.cwd(), "backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const backupFileName = path.join(
  backupDir,
  `backup-${new Date().toISOString().replace(/:/g, "-")}.sql`
);

const pgDumpCommand = `PGPASSWORD=${dbConfig.password} pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f "${backupFileName}"`;

console.log("Starting database backup...");

exec(pgDumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(
    `Database backup completed successfully. File saved as ${backupFileName}`
  );

  // Get file size
  const stats = fs.statSync(backupFileName);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  console.log(`Backup file size: ${fileSizeInMegabytes.toFixed(2)} MB`);
});

const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../src/db/query");

async function run() {
  const schemaDir = path.resolve(process.cwd(), "db", "schema");
  const files = (await fs.readdir(schemaDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No SQL migration files found in db/schema");
    return;
  }

  for (const file of files) {
    const fullPath = path.join(schemaDir, file);
    const sql = await fs.readFile(fullPath, "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
}

run()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

const app = require("./app");
const env = require("./config/env");
const { pool } = require("./db/query");

const server = app.listen(env.port, () => {
  // Keep startup output concise for CLI usage.
  console.log(`Server listening on port ${env.port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

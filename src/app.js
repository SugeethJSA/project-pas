const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const sourceRoutes = require("./routes/sources");
const questionRoutes = require("./routes/questions");
const topicRoutes = require("./routes/topics");
const adminRoutes = require("./routes/admin");
const bulkRoutes = require("./routes/bulk");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Project PAS backend",
  });
});

app.use("/health", healthRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bulk", bulkRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

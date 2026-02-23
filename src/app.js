const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const sourceRoutes = require("./routes/sources");
const questionRoutes = require("./routes/questions");
const topicRoutes = require("./routes/topics");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

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

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

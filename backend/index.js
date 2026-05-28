import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/routes.js";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = process.env.ALLOW_ORIGIN?.split(",").map(o => o.trim()) || [];

// Initialize express
const app = express();

// CORS — allow configured origins + any local network IP on port 8080
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, same-origin)
    if (!origin) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any local network / loopback request (192.168.x.x, 10.x, 172.x, localhost)
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocal) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendError = (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.set("Content-Type", "text/html");
    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Not Found</title>
        <meta name="description" content="Page not found">
      </head>
      <body>
        <p>Not Found! Please check your URL.</p>
      </body>
      </html>
    `);
    return;
  }

  if (req.accepts("json")) {
    res.json({ status: 0, message: "API not found!", data: [] });
    return;
  }

  res.type("txt").send("Not Found");
};

// Routes setup (Make sure other routes are defined after /metrics)
app.use(router);

// API Test endpoint (for load balancer)
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the restaurant API");
});

app.use((req, res) => {
  sendError(req, res);
});

// Set up server port
try {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch {
  console.error("❌ Failed to run server:", err);
  process.exit(1);
}

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import redis from "redis";
import { verifyToken } from "./middlewares/auth.js";

// imports
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import registryRoutes from "./routes/registry.js";
import projectRoutes from "./routes/project.js";

// Configuration
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_BASE_URL,
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cookieParser());

/* ROUTES */
app.use("/api/project", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/registry", verifyToken, registryRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("Server Port: " + PORT));
  })
  .catch((error) => console.log(error + " did not connect"));

/* REDIS SETUP */
const client = redis.createClient(process.env.REDIS_URL);

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

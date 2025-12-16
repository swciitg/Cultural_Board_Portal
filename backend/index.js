import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./routes/user.routes.js";
import { admin,adminRouter } from "./admin_panel/admin-config.js"; // Removed unnecessary import
import cors from "cors";
import bodyParser from "body-parser"; // Explicitly import body-parser
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';
import uploadRoutes from "./routes/upload.route.js";
import authRoutes from "./routes/auth.routes.js";
// Initialize dotenv to load environment variables
dotenv.config();

const API_BASE = process.env.NODE_ENV === 'development' ?  (process.env.API_BASE || '') : '/sports-board/api';
const ADMINPANELROOT = `${API_BASE}/admin`;
const PORT = process.env.PORT || 8000;
const url = process.env.MONGO_URI;
console.log(url);

// Connect to MongoDB
mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(ADMINPANELROOT, adminRouter);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));
// const corsOptions = {
//   origin: process.env.CORS_ORIGIN,
//   optionsSuccessStatus: 200, // Legacy browsers
// };

// Apply CORS Middleware
app.use(cors());

// Use AdminJS first

// Use body-parser after AdminJS router

// Use express.json() and regular router
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use('/image', authRoutes);
app.use('/upload', uploadRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const app = express();
const session = require("express-session");
const morgan = require("morgan");
const favicon = require('serve-favicon');
const path = require('path');
const cors = require("cors");

// Load environment variables from .env file
require("dotenv").config();
require("./config/db_connection");

const port = process.env.PORT;
const router = require("./routes/routers");

// Serve the favicon
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// Enable CORS
app.use(cors());

// Session setup
app.use(
  session({
    secret: "A secret Key to sign the cookie",
    saveUninitialized: false,
    resave: false,
  })
);

// Serve static files from 'public' and 'assets' directories
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../assets')));

// Set view engine to EJS
app.set("view-engine", "ejs");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan("tiny"));

// Use the router for handling routes
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

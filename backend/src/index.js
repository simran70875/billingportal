const express = require("express");
const app = express();
const session = require("express-session");
const morgan = require("morgan");


const cors = require("cors");
app.use(cors());


require("dotenv").config();
require("./config/db_connection");
const port = process.env.PORT;
const router = require("./routes/routers");

app.use(
  session({
    secret: "A secret Key to sign the cookie",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(express.static("public"));
app.use(express.static('assets'));

app.set("view-engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(router);
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

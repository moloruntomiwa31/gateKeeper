import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//db
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "gatekeeper",
  password: "Volatile311#",
  port: 5432,
});
db.connect();
//get pages
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

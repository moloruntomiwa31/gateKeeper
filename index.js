import express from "express";
import pg from "pg";

const app = express();
const port = 4000;
//db
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "gatekeeper",
  password: "Volatile311#",
  port: 5432,
});
db.connect();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;
const saltRounds = 12;

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

//post requests

//register users
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          if (result) {
            res.render("dashboard.ejs", { username: result.rows[0].email });
          } else {
            res.send("Something went wrong");
          }
          // const user = result.rows[0];
          // req.login(user, (err) => {
          //   console.log(err);
          //   res.redirect("/secrets");
          // });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//logging in users
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          return err;
        } else {
          if (result) {
            res.render("dashboard.ejs", { username: user.email });
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      return res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

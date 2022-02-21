/*CONST VARIABLES */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Client } = require("pg");
const port = process.env.PORT || 3000;
var nodemailer = require("nodemailer");

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

/*   APP USES */

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://serverside-project-dev.herokuapp.com/"
  ); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/*  GET CALLS  */

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/users", (req, res) => {
  const user = req.body;
  client.query(`SELECT * FROM userinfo`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      console.log(err.message);
      console.log(err.body);
    }
  });
  client.end;
});

/*  POST CALLS  */

app.post("/api/insertuser", (req, res) => {
  console.log("running insert");
  const user = req.body;
  client.query(
    `INSERT INTO userinfo(name, height, email) VALUES ('${user.name}', ${user.height},'${user.email}')`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
        getdata(user.email, user.height, user.name);
      } else {
        console.log(err.message);
        console.log(err.body);
      }
    }
  );
  client.end;
});

/*  ENVIRONMENTAL VARIABLES  */

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reinhard9921@gmail.com",
    pass: "bzzzbwilsezqdtaa",
  },
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/* FUNCTIONS */

function getdata(email, height, name) {
  client.query(`Select avg(height) from userinfo`, (err, result) => {
    if (!err) {
      const avg = result.rows[0].avg;
      var mailOptions = {
        from: "Reinhard9921@gmail.com",
        to: email,
        subject: "Average Height",
        text: `Hello ${name}, here you can see your height: ${height}cm compared to the average height of ${avg}cm`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
  client.end;
}

client.connect();
module.exports = client;

/* POST CALLS FOR DEVELOPMENT USE ONLY */
/*
app.post("/api/droptableuserinfo", (req, res) => {
    const user = req.body;
    client.query(`DROP TABLE userinfo`, (err, result) => {
      if (!err) {
        res.send(result.rows);
      } else {
        console.log(err.message);
        console.log(err.body);
      }
    });
    client.end;
  });
  
  app.post("/api/createTableuserinfo", (req, res) => {
    const user = req.body;
    client.query(
      `CREATE table userinfo(id SERIAL PRIMARY KEY, name varchar(50), height float, email varchar(100))`,
      (err, result) => {
        if (!err) {
          res.send(result.rows);
        } else {
          console.log(err.message);
          console.log(err.body);
        }
      }
    );
    client.end;
  });
*/

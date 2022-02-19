const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const {Client} = require('pg')
const port = process.env.PORT || 3000;
var nodemailer = require('nodemailer');


const Pool = require("pg").Pool;
require(".env").config();
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});




const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Cvv32sc6",
    database: "postgres"
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://serverside-project-dev.herokuapp.com/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });





function getdata(email, height, name){

    pool.query(`Select avg(height) from userinfo`, (err, result)=>{
            if(!err){
                const avg = result.rows[0].avg;
                var mailOptions = {
                    from: 'Reinhard9921@gmail.com',
                    to: email,
                    subject: 'Average Height',
                    text: `Hello ${name}, here you can see your height: ${height}cm compared to the average height of ${avg}cm`
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            }
        });
        pool.end;
  
}
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'reinhard9921@gmail.com',
      pass: 'bzzzbwilsezqdtaa'
    }
  });
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.send("Hello World");
})

app.post('/api/insertuser', (req,res) => {
    console.log("running insert");
    const user = req.body;
    pool.query(`INSERT INTO userinfo(name, height, email) VALUES ('${user.name}', ${user.height},'${user.email}')`, (err, result)=>{
        if(!err){
            res.send(result.rows);
            getdata(user.email, user.height, user.name);
        }
        else
        {
            console.log(err.message);
            console.log(err.body);
        }
    });
    pool.end;

})
app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));




pool.connect();
module.exports = pool

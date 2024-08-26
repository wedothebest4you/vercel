//importing all modules
import formidable from 'express-formidable';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import express, { response } from 'express';
import session from 'express-session';
import process from 'process';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ObjectId } from 'mongodb';
import { createServer, request } from 'http';
import { dirname } from 'path';

//starting express and http server
var app = express();
var http = createServer(app);
var port = 7000;
const mainURL = 'http://127.0.0.1:' + port;

//adding mongodb and starting the connection

var objectId = new ObjectId();

//const connectionstring = process.env.MONGODB_CONNECTIONSTRING;
const connectionstring = 'mongodb://127.0.0.1:27017'; // change 1

const mongoClient = new MongoClient(connectionstring);

app.set('view engine', 'ejs');
app.set('views', 'views');

//adding paths to the static files
app.use('/static', express.static('public'));

// app.use("/static", express.static(dirname("public")))
// app.use("/public/css", express.static(dirname("/public/css")));
// app.use("/public/js", express.static(dirname("/public/js")));
// app.use("/public/@fortawesome/fontawesome-free", express.static(dirname("/public/@fortawesome/fontawesome-free")));

//adding function for the session when the user logs in
app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(function (request, response, next) {
  request.mainURL = mainURL;
  request.isLogin = typeof request.session.user !== 'undefined';
  request.user = request.session.user;

  next();
});

//Creating the mailing logic
app.use(formidable());

let sender = 'oluwafunmikelaja@gmail.com'; //nodemailerform
let nodemailerObject = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};

//starting the server
// http:127.0.0.1/
console.log('Connecting...');
http.listen(port, async function () {
  console.log('Sever started at ' + mainURL);

  // Connect to the MongoDB cluster
  await mongoClient.connect();

  // Make the appropriate DB calls
  await mongoClient.db('file_transfer').command({ ping: 1 });
  console.log('Conneceted Sucessfully');
});

// home api endpoint
app.get('/', function (request, result) {
  result.render('index', {
    request: request,
  });
});

// register api get endpoint
app.get('/Register', function (request, result) {
  result.render('Register', {
    request: request,
  });
});

//register post endpoint to database for verification
app.post('/Register', async (request, result) => {
  const name = request.fields.name;
  const email = request.fields.email;
  const password = request.fields.password;
  const reset_token = '';
  const isVerified = false;
  const verification_token = new Date().getTime();

  let database = mongoClient.db('file_transfer');
  // let database = mongoClient.db("file_transfer")
  let user = await database.collection('users').findOne({
    email: email,
  });

  // if no user, create one and add to database
  if (user == null) {
    bcrypt.hash(password, 10, async function (error, hash) {
      try {
        await database.collection('users').insertOne(
          {
            name: name,
            email: email,
            password: hash,
            reset_token: reset_token,
            uploaded: [],
            sharedWithMe: [],
            isVerified: isVerified,
            verification_token: verification_token,

            // console.log(error)
          },
          async function (error, data) {
            const transporter = nodemailer.createTransport(nodemailerObject);

            const text =
              'Please verify your account by clicking the following link: ' +
              mainURL +
              '/verifyEmail/' +
              email +
              '/' +
              verification_token;
            const html =
              "Please verify your account by clicking the following link: <br><br> <a href=' " +
              mainURL +
              '/verifyEmail/' +
              email +
              '/' +
              verification_token +
              "'>Confirm Email </a> <br><br> Thank you";

            await transporter.sendMail(
              {
                from: sender, // Use the email address from the auth object
                to: email,
                subject: 'Email verification',
                text: text,
                html: html,
              },
              (error, info) => {
                if (error) {
                  console.log(error);
                  // res.status(404).send('Email not sent successfully')
                } else {
                  console.log('Email sent: ' + info.response);
                  // res.status(200).send("Email sent successfully")
                }

                // Render the view with the request object
                // Set request status and message for success
              }
            );
          }
        );
        request.status = 'success';
        request.message = `Signed up successfully. An email has been sent to verify your account. Once verified, you will
                    be able to login and start using the transfer.`;

        result.render('Register', {
          request: request,
        });
      } catch (error) {
        console.log(error);
      }
      // Handle any errors
      // console.log("Error sending email:", error);

      // Set request status and message for error
      // request.status = "error";
      // request.message = `Failed to send verification email. Please try again later.`;
    });
  } else {
    //if a user is found
    request.status = 'error';
    request.message = 'Email already exists';

    result.render('Register', {
      request: request,
    });
  }
});

export default app; // change 2
//It is neither sending the message nor giving any feedback for the new user

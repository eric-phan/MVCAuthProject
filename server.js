const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
// morgan shows you the log requests, can see them in the terminal
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const todoRoutes = require("./routes/todos");

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB();
// call the connect db function

app.set("view engine", "ejs");
app.use(express.static("public"));
// put css to make it prettier in this folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// two lines above allow you to grap parts of the requests made to the server
app.use(logger("dev"));
// using morgan
// Sessions
app.use(
  // use packages to handle the sessions
  session({
    secret: "keyboard cat",
    // makes the cookies more unique
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    // allows you to have repeat sessions, stores the session to crossmatch it with cookies in browser
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// flash gives you the error messages when you do not enter login info correctly

app.use("/", mainRoutes);
app.use("/todos", todoRoutes);
// app know how to handle the requests coming in 

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});

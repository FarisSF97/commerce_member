const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();
const app = express();
const routes = require("./common/routes");

app.set("view engine", "ejs");
app.use(express.json());

app.use(
  session({
    name: "member.sid",
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, sameSite: "lax" },
  }),
);

app.use("/", routes);

app.set("views", path.join(__dirname, "modules"));
app.listen(4500, "0.0.0.0", () => {
  console.log("Member server running on port 4500");
});

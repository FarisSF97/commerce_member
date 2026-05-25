const express = require('express');
const router = express.Router();
const auth = require('../modules/auth/member_auth_controller');
const member = require('../modules/member/member_controller');

router.get("/login", (req, res) => {
  auth.login(req, res);
});

router.post("/process_login", async (req, res) => {
  auth.processLogin(req, res);
});

router.get("/logout", (req, res) => {
  auth.logout(req, res);
});

router.post("/process_cancel_order", async (req, res) => {
  member.cancelOrder(req, res);
});

router.get("/dashboard", async (req, res) => {
  member.dashboard(req, res);
});

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;

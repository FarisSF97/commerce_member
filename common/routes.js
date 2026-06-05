const express = require('express');
const router = express.Router();
const auth = require('../modules/auth/auth_controller');
const profile = require('../modules/profile/profile_controller');
const order = require('../modules/order/order_controller');
const dashboard = require('../modules/dashboard/dashboard_controller');

router.get("/login", (req, res) => {
  auth.login(req, res);
});

router.post("/process_login", async (req, res) => {
  auth.processLogin(req, res);
});

router.get("/logout", (req, res) => {
  auth.logout(req, res);
});

router.get("/forgot-password", (req, res) => {
  auth.forgotPassword(req, res);
});

router.post("/process_forgot_password", async (req, res) => {
  auth.processForgotPassword(req, res);
});

router.get("/reset-password/:token", async (req, res) => {
  auth.resetPassword(req, res);
});

router.post("/process_reset_password", async (req, res) => {
  auth.processResetPassword(req, res);
});

router.post("/process_change_password", async (req, res) => {
  auth.changePassword(req, res);
});

router.post("/process_update_profile", async (req, res) => {
  profile.updateProfile(req, res);
});

router.post("/process_cancel_order", async (req, res) => {
  order.cancelOrder(req, res);
});

router.get("/dashboard", async (req, res) => {
  dashboard.index(req, res);
});

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;

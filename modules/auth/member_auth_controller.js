const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const auth = {
  login: (req, res) => {
    res.render('auth/views/login');
  },

  processLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const apiResponse = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (apiResponse.data.status === 'success') {
        req.session.user = apiResponse.data.data;
        return res.json({ status: 'success', message: 'Login successful' });
      }

      return res.status(apiResponse.data.code || 400).json({
        status: 'failed',
        message: apiResponse.data.message || 'Login failed'
      });
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: message
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  },

  forgotPassword: (req, res) => {
    res.render('auth/views/forgot_password');
  },

  processForgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'failed', message: 'Email diperlukan' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/forgot_password`, { email }, {
        withCredentials: true
      });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal memproses'
      });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    res.render('auth/views/reset_password', { token });
  },

  processResetPassword: async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ status: 'failed', message: 'Token dan password diperlukan' });
    }

    if (password.length < 4) {
      return res.status(400).json({ status: 'failed', message: 'Password minimal 4 karakter' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/reset_password`, { token, password }, {
        withCredentials: true
      });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mereset password'
      });
    }
  }
};

module.exports = auth;

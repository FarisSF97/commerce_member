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
  }
};

module.exports = auth;

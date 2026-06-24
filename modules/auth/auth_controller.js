const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5100';

const auth = {
  login: (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
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

    if (!token) {
      return res.render('auth/views/reset_password', { token: null, tokenValid: false, error: 'Token tidak valid' });
    }

    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/validate_reset_token/${encodeURIComponent(token)}`, {
        withCredentials: true
      });

      if (apiResponse.data.status === 'success') {
        return res.render('auth/views/reset_password', { token, tokenValid: true, error: null });
      }

      return res.render('auth/views/reset_password', { token: null, tokenValid: false, error: apiResponse.data.message || 'Token tidak valid atau sudah kedaluwarsa' });
    } catch (error) {
      console.error('Validate reset token error:', error);
      const message = error.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa';
      return res.render('auth/views/reset_password', { token: null, tokenValid: false, error: message });
    }
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
  },

  changePassword: async (req, res) => {
    try {
      const { password, current_password } = req.body;
      const user = req.session.user;

      if (!user || !user.email) {
        return res.status(401).json({ status: 'failed', message: 'Silakan login terlebih dahulu' });
      }

      if (!current_password) {
        return res.status(400).json({ status: 'failed', message: 'Password saat ini diperlukan' });
      }

      if (!password || password.length < 4) {
        return res.status(400).json({ status: 'failed', message: 'Password baru minimal 4 karakter' });
      }

      const apiResponse = await axios.post(`${API_BASE_URL}/change_password`, {
        email: user.email,
        current_password,
        password
      }, {
        withCredentials: true
      });

      if (apiResponse.data.status === 'success') {
        req.session.destroy((err) => {
          if (err) console.error('Session destroy error:', err);
        });
      }

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Change password error:', error);
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(500).json({
        status: 'failed',
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      });
    }
  },

  uploadAvatar: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ status: 'failed', message: 'Silakan login terlebih dahulu' });
    }

    const { foto_base64 } = req.body;
    if (!foto_base64) {
      return res.status(400).json({ status: 'failed', message: 'Foto diperlukan' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/upload_avatar`, {
        email: req.session.user.email,
        foto_base64
      }, { withCredentials: true });

      if (apiResponse.data.status === 'success') {
        req.session.user.foto = apiResponse.data.data.foto;
        return res.json({ status: 'success', data: { foto: apiResponse.data.data.foto }, message: 'Foto profil berhasil diperbarui' });
      }

      return res.status(400).json({ status: 'failed', message: apiResponse.data.message || 'Gagal mengunggah foto' });
    } catch (error) {
      console.error('Upload avatar error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal mengunggah foto profil'
      });
    }
  }
};

module.exports = auth;

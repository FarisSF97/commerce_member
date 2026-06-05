const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const profile = {
  updateProfile: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ status: 'failed', message: 'Silakan login terlebih dahulu' });
    }

    const account_id = req.session.user.id;
    const { nama, email, no_wa } = req.body;

    if (!nama && !email && !no_wa) {
      return res.status(400).json({ status: 'failed', message: 'Tidak ada data yang diubah' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/update_profile`, {
        account_id, nama, email, no_wa
      }, { withCredentials: true });

      if (apiResponse.data.status === 'success') {
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
          }
        });
        return res.json({ status: 'success', message: 'Data berhasil disimpan. Silakan cek email untuk aktivasi ulang.', redirect: '/login' });
      } else {
        return res.status(400).json({ status: 'failed', message: apiResponse.data.message || 'Gagal update profil' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal memperbarui profil'
      });
    }
  }
};

module.exports = profile;

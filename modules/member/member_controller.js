const axios = require('axios');

const API_BASE_URL = 'http://localhost:5100';

const member = {
  cancelOrder: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ status: 'failed', message: 'Silakan login terlebih dahulu' });
    }

    const { order_id } = req.body;
    const account_id = req.session.user.id;

    if (!order_id) {
      return res.status(400).json({ status: 'failed', message: 'order_id diperlukan' });
    }

    try {
      const apiResponse = await axios.post(`${API_BASE_URL}/cancel_order/${order_id}`, {
        account_id
      }, {
        withCredentials: true
      });

      return res.json(apiResponse.data);
    } catch (error) {
      console.error('Cancel order error:', error);
      return res.status(error.response?.status || 500).json({
        status: 'failed',
        message: error.response?.data?.message || 'Gagal cancel pesanan'
      });
    }
  },

  dashboard: async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const user = req.session.user;
    const accountId = user.id;

    try {
      const ordersRes = await axios.get(`${API_BASE_URL}/get_orders/${accountId}`, {
        withCredentials: true
      });

      const orders = ordersRes.data.status === 'success' ? ordersRes.data.data : [];

      return res.render('member/views/dashboard', {
        user: user,
        orders: orders
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.render('member/views/dashboard', {
        user: user,
        orders: []
      });
    }
  }
};

module.exports = member;

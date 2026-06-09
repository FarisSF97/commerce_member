const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5100';

const dashboard = {
  index: async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const user = req.session.user;
    const accountId = user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = (req.query.search || '').trim();
    const validTabs = ['info', 'security', 'orders'];
    const activeTab = validTabs.includes(req.query.tab) ? req.query.tab : 'info';
    const allowedSortBy = ['invoice', 'tanggal', 'produk', 'qty', 'total', 'status'];
    const sort_by = allowedSortBy.includes(req.query.sort_by) ? req.query.sort_by : 'tanggal';
    const sort_dir = req.query.sort_dir === 'ASC' ? 'ASC' : 'DESC';
    const allowedStatuses = ['pending', 'paid', 'cancel'];
    const filter_status = allowedStatuses.includes(req.query.filter_status) ? req.query.filter_status : '';

    try {
      const ordersRes = await axios.get(`${API_BASE_URL}/get_orders/${accountId}`, {
        params: { page, limit, search, sort_by, sort_dir, filter_status },
        withCredentials: true
      });

      const orders = ordersRes.data.status === 'success' ? ordersRes.data.data.orders : [];
      const pagination = ordersRes.data.status === 'success' ? ordersRes.data.data.pagination : { page: 1, totalPages: 1, total: 0 };

      return res.render('dashboard/views/dashboard', {
        user: user,
        orders: orders,
        page: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total,
        limit: pagination.limit,
        activeTab: activeTab,
        search: search,
        sort_by: sort_by,
        sort_dir: sort_dir,
        filter_status: filter_status
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.render('dashboard/views/dashboard', {
        user: user,
        orders: [],
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
        activeTab: activeTab,
        search: search,
        sort_by: sort_by,
        sort_dir: sort_dir,
        filter_status: filter_status
      });
    }
  }
};

module.exports = dashboard;

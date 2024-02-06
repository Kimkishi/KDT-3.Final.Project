const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://usms.serveftp.com',
      changeOrigin: true,
    })
  );
};

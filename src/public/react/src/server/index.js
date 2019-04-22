import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import proxyMiddleware from 'http-proxy-middleware';
import webpackDevConfig from '../../webpack.dev.config';

const PATH = 'https://marketplace.opennebula.systems';
const PORT = 8181;
const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  const compiler = webpack(webpackDevConfig);
  app.use(
    webpackMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath
    })
  );
  app.use(webpackHotMiddleware(compiler));
  app.use(
    '/proxy',
    proxyMiddleware({
      target: process.env.API_URL || PATH,
      pathRewrite: { '^/proxy/': '/' },
      changeOrigin: true,
      onProxyReq(proxyReq) {
        proxyReq.setHeader('Origin', process.env.API_URL || PATH);
      },
      onProxyRes(proxyRes) {
        /* eslint-disable */
        proxyRes.headers['Origin'] = process.env.API_URL || PATH;
        proxyRes.headers['Access-Control-Allow-Origin'] = `127.0.0.1:${PORT}`;
        proxyRes.headers['Access-Control-Allow-Methods'] =
          'GET, POST, OPTIONS, PUT, PATCH, DELETE, CONNECT';
        proxyRes.headers['Access-Control-Allow-Headers'] =
          'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
        delete proxyRes.headers.allow;
      }
    })
  );
  app.use('*', function(req, res, next) {
    var filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function(err, result) {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
  
} else {
  const DIST_DIR = path.join(process.cwd(), 'public');
  app.use('/', express.static(DIST_DIR));
  app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}
app.listen(PORT, '0.0.0.0', err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at http://localhost:${PORT}`);
});
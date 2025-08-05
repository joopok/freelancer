const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7005;

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  let filePath;
  if (req.url === '/') {
    filePath = path.join(__dirname, '.next/server/app/index.html');
  } else if (req.url.startsWith('/_next/static/')) {
    filePath = path.join(__dirname, '.next', req.url.replace('/_next/', ''));
  } else {
    filePath = path.join(__dirname, '.next/server/app', req.url + '.html');
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log('Error:', error.code, filePath);
      // Try index page for SPA routing
      fs.readFile(path.join(__dirname, '.next/server/app/index.html'), (err, indexContent) => {
        if (err) {
          res.writeHead(404);
          res.end('Page not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf8');
        }
      });
    } else {
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.css') contentType = 'text/css';
      if (ext === '.json') contentType = 'application/json';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:' + PORT + '/');
});
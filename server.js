const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7005;

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  let filePath;
  if (req.url === '/') {
    filePath = path.join(__dirname, '.next/server/app/page.html');
  } else if (req.url.startsWith('/_next/static/')) {
    filePath = path.join(__dirname, '.next', req.url.replace('/_next/', ''));
  } else {
    filePath = path.join(__dirname, '.next/server/app', req.url + '.html');
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log('Error:', error.code, filePath);
      res.writeHead(404);
      res.end('Page not found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:' + PORT + '/');
});
EOF < /dev/null

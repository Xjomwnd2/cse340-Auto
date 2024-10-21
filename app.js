// Importing the necessary module
const http = require('http');

// Create a server object
http.createServer((req, res) => {
  // Set the response HTTP header with status and content type
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // Send the response body
  res.end('Hello, World!\n');
}).listen(3000, () => {
  // Callback function to display when the server is running
  console.log('Server is running at http://localhost:3000/');
});



import http from 'http';

http.createServer((req, res) => {
  res.write("I'm alive");
  res.end();
}).listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

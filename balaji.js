var http = require('http');
var url = require('url');
var port =8087;

  http.createServer(function (req, res) {


        console.log("Hiiiiiiiii");
        console.log(req.url)
        res.writeHead(200, {'Content-Type': 'text/html'});
          var q = url.parse(req.url, true).query;
           var txt = q.year + " " + q.month;
          res.end(txt);
  }).listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
  })













  // http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   var q = url.parse(req.url, true).query;
//   var txt = q.year + " " + q.month;
//   res.end(txt);
// }).listen(8080);

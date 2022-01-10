const http = require('http');
const querystring = require('querystring');

//http get
// const server = http.createServer((req, res) => {
//   console.log(req.method);
//   const url = req.url;
//   console.log('url', url);
//   req.query = querystring.parse(url.split('?')[1]);
//   console.log('req.query', req.query);
//   res.end(JSON.stringify(req.query));
// });

//http post
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     console.log('req', req.headers['content-type']);

//     let postData = '';
//     req.on('data', chunk => {
//       console.log('check', chunk.toString());
//       postData += chunk.toString();
//     });

//     req.on('end', () => {
//       console.log('postdATA', postData);
//       res.end('hello world');
//     });
//   }
// });

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  const path = url.split('?')[0];
  const query = querystring.parse(url.split('?')[1]);

  res.setHeader('Content-type', 'application/json');

  const resData = {
    method,
    url,
    path,
    query
  };

  if (method === 'GET') {
    res.end(JSON.stringify(resData));
  }

  if (method === 'POST') {
    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      resData.postData = postData;

      res.end(JSON.stringify(resData));
    });
  }
});
server.listen(8000);

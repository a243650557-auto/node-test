const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('qingqiu kais', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  //假设在处理cookie
  req.cookie = {
    userId: 'abc123'
  };
  next();
});

app.use((req, res, next) => {
  //假设在处理post data
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    };
    next();
  });
});

app.use('/api', (req, res, next) => {
  //假设在处理post data
  console.log('处理api路由');
  next();
});

app.get('/api', (req, res, next) => {
  //假设在处理post data
  console.log('get 处理api路由');
  next();
});

app.post('/api', (req, res, next) => {
  //假设在处理post data
  console.log('post 处理api路由');
  next();
});

// 模拟登录验证
function loginCheck(req, res, next) {
  console.log('模拟登陆失败');
  setTimeout(() => {
    res.json({
      error: -1,
      msg: '登陆失败'
    });
    //登录成功才需要next
    // next()
  });
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  //假设在处理post data
  console.log('get 处理api/get-cookie路由');
  res.json({
    errno: 0,
    data: req.cookie
  });
});

app.post('/api/post-cookie', (req, res, next) => {
  //假设在处理post data
  console.log('post 处理api/get-cookie路由');
  res.json({
    errno: 0,
    data: req.body
  });
});

app.use((req, res, next) => {
  res.json({
    errno: -1,
    data: '404'
  });
});

app.listen(4000, () => {
  console.log('server is running on 4000');
});

const querystring = require('querystring');
const handleUserRouter = require('./src/router/user');
const handleBlogRouter = require('./src/router/blog');
const { get, set } = require('./src/db/redis');
const { access } = require('./src/utils/log.js');
//session数据
// let SESSION_DATA = {};

//设置cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }

    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  //记录access log
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers['user-agent']
    } -- ${Date.now()}`
  );

  res.setHeader('Content-type', 'application/json');

  const resData = {
    name: 'sju',
    site: 'imooc'
  };

  const url = req.url;
  req.path = url.split('?')[0];

  //解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ''; //k1=v1;k2=v2
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0];
    const val = arr[1];
    req.cookie[key] = val;
  });
  console.log('req.cookie', req.cookie);
  console.log('req.session', req.session);

  //解析session
  // let needSetCookie = false;
  // let userId = req.cookie.userid;
  // if (userId) {
  //   if (SESSION_DATA[userId]) {
  //     req.session = SESSION_DATA[userId];
  //   } else {
  //     SESSION_DATA[userId] = {};
  //     req.session = SESSION_DATA[userId];
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  //   req.session = SESSION_DATA[userId];
  // }

  //解析session 使用redis
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;

    //初始化session
    set(userId, {});
  }
  req.query = querystring.parse(url.split('?')[1]);
  //获取session
  req.sessionId = userId;
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData == null) {
        set(req.sessionId, {});
        req.session = {};
      } else {
        req.session = sessionData;
      }
      console.log('req.session', req.session);

      return getPostData(req);
    })
    .then(postData => {
      req.body = postData;

      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-cookie',
              `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            );
          }
          if (blogData) {
            res.end(JSON.stringify(blogData));
            return;
          }
        });
        return;
      }

      //处理blog路由
      // const blogData = handleBlogRouter(req, res);
      // if (blogData) {
      //   res.end(JSON.stringify(blogData));
      //   return;
      // }

      //处理user理由
      // const userData = handleUserRouter(req, res);
      // if (userData) {
      //   res.end(JSON.stringify(userData));
      //   return;
      // }

      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-cookie',
              `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
          return;
        });
        return;
      }
      //未命中路由，返回404
      res.writeHead(404, {
        'content-type': 'text-plain'
      });
      res.write('404 not found');
      res.end();
    });
};

module.exports = serverHandle;

const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');
const login = (username, password) => {
  username = escape(username);

  //生成加密密码
  password = genPassword(password);
  console.log('passrod', password);

  password = escape(password);

  const sql = `select username, realname from users where username=${username} and password=${password}`;
  return exec(sql).then(rows => {
    return rows[0] || {};
  });
  // if (username === 'zhangsan' && password === '123') {
  //   return true;
  // } else {
  //   return false;
  // }
};

module.exports = {
  login
};

const { exec } = require('../db/mysql');
const xss = require('xss');
const getList = (author, keyword) => {
  //先返回假数据，格式是正确的
  // return [
  //   {
  //     id: 1,
  //     title: '标题A',
  //     content: '内容A',
  //     createTime: 1641541738264,
  //     author: 'zhangsan'
  //   },
  //   {
  //     id: 2,
  //     title: '标题B',
  //     content: '内容A',
  //     createTime: 1641541769284,
  //     author: 'zhangsan11'
  //   }
  // ];

  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += 'order by createtime desc';

  return exec(sql);
};

const getDetail = id => {
  // return {
  //   id: 1,
  //   title: "标题A",
  //   content: "内容A",
  //   createTime: 1641541738264,
  //   author: "zhangsan",
  // };
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then(rows => {
    return rows[0];
  });
};

const newBlog = (blogData = {}) => {
  console.log('blogData', blogData);
  const title = xss(blogData.title);
  const content = blogData.content;
  const author = blogData.author;
  const createtime = Date.now();

  const sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}','${createtime}', '${author}')`;
  // return {
  //   id: 3,
  // };
  return exec(sql).then(insertData => {
    console.log('insertData', insertData);
    return {
      id: insertData.insertId
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  console.log('update blog', id, blogData);
  // return true;

  const title = blogData.title;
  const content = blogData.content;
  const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`;

  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

const delBlog = (id, author) => {
  // return true;
  const sql = `delete from blogs where id = '${id}' and author='${author}'`;

  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};

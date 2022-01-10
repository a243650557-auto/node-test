const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

//🙆🏻统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("尚未登录"));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method;

  if (method === "GET" && req.path === "/api/blog/list") {
    let author = req.query.author || "";
    const keyword = req.query.keyword || "";

    // return new SuccessModel(listData);
    // return {
    //   msg: '这是获取博客列表的接口'
    // };

    if (req.query.isadmin) {
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        //未登录
        return loginCheckResult;
      }
      author = req.session.username;
    }
    const result = getList(author, keyword);

    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  if (method === "GET" && req.path === "/api/blog/detail") {
    const id = req.query.id;
    // const data = getDetail(id);
    // return new SuccessModel(data);
    const result = getDetail(id);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  if (method === "POST" && req.path === "/api/blog/new") {
    const blogData = req.body;
    // const data = newBlog(req.body);
    // return new SuccessModel(data);

    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      //未登录
      return loginCheckResult;
    }
    const author = req.session.username;
    req.body.author = author;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  if (method === "POST" && req.path === "/api/blog/update") {
    const id = req.query.id;
    console.log("iiiddd", id);

    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      //未登录
      return loginCheckResult;
    }
    const result = updateBlog(id, req.body);
    return result.then((val) => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新博客失败");
      }
    });
  }

  if (method === "POST" && req.path === "/api/blog/del") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      //未登录
      return loginCheck;
    }
    const id = req.query.id;
    const author = req.session.username;

    const result = delBlog(id, author);
    return result.then((val) => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("shanchu博客失败");
      }
    });
    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("shancu博客失败");
    // }
  }
};

module.exports = handleBlogRouter;

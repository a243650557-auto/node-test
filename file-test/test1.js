const fs = require('fs');
const path = require('path');

//__dirname 当前js的目录
const fileName = path.resolve(__dirname, 'data.txt');

// 读取文件内容
// fs.readFile(fileName, (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   //data是二进制，需要转换为字符串
//   console.log(data.toString());
//   return;
// });

//写入文件
// const content = '这是新的内容111\n';
// const opt = {
//   flag: 'a' // 追加写入，覆盖用 W
// };
// fs.writeFile(fileName, content, opt, err => {
//   if (err) {
//     console.log(err);
//   }
// });

//判断文件是否存在
fs.exists(fileName + '1', exist => {
  console.log('exist', exist);
});

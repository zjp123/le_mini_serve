const mongoose = require("mongoose");
// mongoose自己实现的Promise与规范的Promise存在差异，在这里使用node.js实现的Promise global 是服务器端的全局对象
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/first_mon", { useNewUrlParser: true });

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true)
}

const db = mongoose.connection;

db.on("error", () => console.error("连接数据库失败"));

db.once("open", async () => {
  // 2.定义⼀一个Schema - Table
  const Schema = mongoose.Schema({
      openId: String,
      name: String,
      nickName: String,
      age: Number,
      area: String,
      sex: String,
      headImg: String
    });
  // 3.编译⼀一个Model, 它对应数据库中复数、⼩小写的Collection 
  const Model = mongoose.model("users", Schema);
  try {
    // 4.创建，create返回Promise 
    let r = await Model.create({ openId: null, name: 'zhansan',nickName: 'san', age: 18, area: '北京', sex: '男', headImg: ''});
    console.log("插⼊入数据:", r);
    // 5.查询，find返回Query，它实现了了then和catch，可以当Promise使⽤用 // 如果需要返回Promise，调⽤用其exec()
    // r = await Model.find({ name: "苹果" }); console.log("查询结果:", r);
    // r = await Model.updateOne({ name: "苹果" }, { $set: { name: '芒果' } });
    console.log("更更新结果:", r);
  } catch (error) {
    console.log(error);
  } });

  module.exports = db;
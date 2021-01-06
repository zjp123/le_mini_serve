const mongoose = require("mongoose");
// mongoose自己实现的Promise与规范的Promise存在差异，在这里使用node.js实现的Promise global 是服务器端的全局对象
mongoose.Promise = global.Promise;
const config = require('../config');
mongoose.connect(config.mongodb, { useNewUrlParser: config.useNewUrlParser });
// localhost:27017 会在这个链接下 创建一个lexue_mon数据库

if (process.env.NODE_ENV !== 'production') {
  console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
  mongoose.set('debug', true);
}

const client = mongoose.connection;
let userDB = null;

client.on("error", () => console.error("连接数据库失败"));

client.once("open", async () => {
  // 2.定义⼀一个Schema - Table
  const userSchema = mongoose.Schema({
      openId: String,
      name: String,
      nickName: String,
      age: Number,
      area: String,
      sex: String,
      date: { type: Date, default: Date.now }, // 指定默认值
      headImg: String
    });
  // Schema.methods.testFn = function(cb) {
  //   return this.model('users').find({ name: this.name }, cb);
  // };
  // 3.编译⼀一个Model, 它对应数据库中复数、⼩小写的Collection
  userDB = mongoose.model("users", userSchema); // 创建users表(集合)
  // let tableInstance = new Table_collection({ name: 'zhansan' });

  // tableInstance.testFn(function(err, val) {
  //   // console.log(val); //
  // });
  try {
    // 4.创建，create返回Promise
    // let r = await Table_collection.create({ openId: null, name: 'zhansan',nickName: 'san', age: 18, area: '北京', sex: '男', headImg: ''});
    // console.log("插⼊入数据:", r);
    // 5.查询，find返回Query，它实现了了then和catch，可以当Promise使⽤用 // 如果需要返回Promise，调⽤用其exec()
    // r = await Model.find({ name: "苹果" }); console.log("查询结果:", r);
    // r = await Model.updateOne({ name: "苹果" }, { $set: { name: '芒果' } });
    // console.log("更更新结果:", r);
    // console.log('链接成功');

  } catch (error) {
    console.log(error);
  } });

  const DbHandle = function () {};
  // DbHandle.prototype.findById = function(name, callback) {
  //   userDB.find({ name }, function (err, user) {
  //     if (!err) {
  //       callback(null, user);
  //     }
  //   });
  // };

  DbHandle.prototype.findByName = async (ctx, next) => {
    ctx.body = 666;
    return;
    // console.log();
    let data = null;
    await userDB.find({ name: ctx.params.name }, function (err, user) {
      // console.log('22222');
      if (!err) {
        // console.log('8888');
        data = user;
        // ctx.body = 888;

      }
    });
    ctx.body = {
      success: true,
      code: 200,
      data
    };
  };

  module.exports = DbHandle;

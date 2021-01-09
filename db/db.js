const mongoose = require("mongoose");
// mongoose自己实现的Promise与规范的Promise存在差异，在这里使用node.js实现的Promise global 是服务器端的全局对象
mongoose.Promise = global.Promise;
const config = require('../config');
const logsUtil = require('../util/handle-logger');
mongoose.connect(config.mongodb, { useNewUrlParser: config.useNewUrlParser });
// localhost:27017 会在这个链接下 创建一个lexue_mon数据库

if (process.env.NODE_ENV !== 'production') {
  console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
  mongoose.set('debug', true);
}

const client = mongoose.connection;
let userDB = null;

client.on("error", (err) => {
  console.error("连接数据库失败");
  logsUtil.logError(err);

});

client.once("open", async () => {
  // 2.定义⼀一个Schema - Table
  const userSchema = mongoose.Schema({
      openId: String,
      nickName: String,
      age: Number,
      city: String,
      province: String,
      country: String,
      language: String,
      gender: String,
      watermark: Object,
      date: { type: Date, default: Date.now }, // 指定默认值
      avatarUrl: String
    });
  userSchema.index({ openId:1, nickName: 1, date: -1 }); // 索引 方便快速查询
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
  DbHandle.prototype.insert = async (param) => {
    console.log(param, 'paramparamparam');
    // const searchOne = await userDB.findOne({ openId:  param.openId}, function (err, user) {
    //   // console.log('22222');
    //   if (!err) {
    //     // console.log('8888');
    //     // ctx.body = 888;


    //   }
    // });
    try {
      const findResult = await userDB.find({ nickName:  param.nickName});
      if (findResult.length > 0) {
        console.log('已经入库');
        return 'success';
      }
    } catch (error) {
      console.log('查询是否入库失败');
      return 'err';
    }
    try {
      const userOne = new userDB(param);
      await userOne.save();
      console.log('插入成功');
      return 'success';
    } catch (error) {
      console.log('插入错误');
      return 'err';

    }

  };

  DbHandle.prototype.findByName = async (ctx, next) => {

    try {
      const findResult = await userDB.findOne({ nickName:  '稻麦穗'});
      console.log(findResult, '查人查人查人查人查人查人查人');
      ctx.body = {
        success: true,
        code: 200,
        data: findResult
      };
    } catch (error) {
      ctx.body = {
        success: false,
        code: 500,
        data: error
      };
    }

    // let data = null;
    // const searchOne =  await userDB.find({ nickName:  'fff'}, function (err, user) {
    //   // console.log('22222');
    //   if (!err) {
    //     // console.log('8888');
    //     data = user;
    //     // ctx.body = 888;

    //   }
    // });
    // console.log(searchOne, 'searchOnesearchOnesearchOne');
    // ctx.body = {
    //   success: true,
    //   code: 200,
    //   data
    // };
  };

  module.exports = DbHandle;

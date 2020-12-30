const Router = require('@koa/router');
const router = new Router({ prefix: '/api' });
const DB = require('../db/db');
let DbHandle = new DB();

router.get('/user', (ctx, next) => {
  // ctx.router available
  console.log(ctx.path, 'path');
  // ctx.body = `${ctx.path}`;
});

// router.get('/find/:name', async function(ctx, next){
//   console.log('查找城功夫1：', ctx.params.name);
//   // ctx.body = '88888';
//   // return DbHandle.findById(ctx.params.name).then(function (user) {
//     // ctx.body = 5566;
//   // });
//   await DbHandle.findById(ctx.params.name, function(error, user) {
//     if (error) {
//       console.log(error);
//     }
//     console.log('查找城功夫2：', ctx);
//     // ctx.body = JSON.stringify(user);
//     ctx.body = 5566;

//     // ctx.body = 5566;
//   });
// });

router.get('/find/:name', DbHandle.findByName);

module.exports = router;

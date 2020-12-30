const Koa = require('koa');
const app = new Koa();
const apiRouter = require('./router/route');
const DB = require('./db/db');
const config = require('./config');
let DbHandle = new DB();

app.use(async(ctx, next) => {
  ctx.DbHandle = DbHandle;
  // ctx; // is the Context
  // ctx.request; // is a koa Request
  // ctx.response; // is a koa Response

  await next();
});

app
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

app.use(async ctx => {
  console.log('*******************');

  ctx.body = 'Hello World';
});

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
  if((ctx.status === 404 && err.status === undefined) || err.status === 500){
    return;
  }
});

app.listen(process.env.PORT || config.port, () => {
  console.log('成功监听3000端口', process.env.PORT );
});

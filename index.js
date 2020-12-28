const Koa = require('koa');
const app = new Koa();
const apiRouter = require('./router/route');
const db = require('./db/db');

app
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

app.use(async(ctx, next) => {
  ctx.db = db
  await next()
})

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('成功监听3000端口');
});
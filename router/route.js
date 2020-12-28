const Router = require('@koa/router');
const router = new Router({ prefix: '/api' });

router.get('/user', (ctx, next) => {
  // ctx.router available
  console.log(ctx.path, 'path');
  ctx.body = `${ctx.path}`;
});

module.exports = router;
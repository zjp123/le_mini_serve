const Koa = require('koa');
const app = new Koa();
// const app = require('./util/app-contex');
const jwt = require("jsonwebtoken");
const apiRouter = require('./router/route');
const apiLexuelearnRouter = require('./router/lexuelearn-router');
const session = require('koa-session');// 这个只能配合浏览器玩(或者cookie玩)，服务器端自己设置，自己获取是不行的
// 不用浏览器的话，可以加上redis存储，每次都去Redis拿 就可以了
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors'); // 没有他ctx.session 获取不到
const DB = require('./db/db');
const config = require('./config');
let DbHandle = new DB();
// logger
// const logger = require('log4js');
const logsUtil = require('./util/handle-logger');


// app.use(logsUtil.logInfo);
app.use(async (ctx, next) => {
  const start = new Date();					          // 响应开始时间
  let intervals;								              // 响应间隔时间
  try {
      await next();
      intervals = new Date() - start;
      logsUtil.logResponse(ctx, intervals);	  //记录响应日志
  } catch (error) {
      intervals = new Date() - start;
      logsUtil.logError(ctx, error, intervals);//记录异常日志
  }
});

//配置session的中间件
app.use(cors({
  credentials: true
}));

// 签名key keys作⽤用 ⽤用来对cookie进⾏行行签名
app.keys = ['lexue_homework_mini'];
const SESS_CONFIG = {
  key: 'le_homework', // cookie键名 浏览器中
  maxAge: 172800000, // 有效期，默认⼀2天
  httpOnly: true, // 仅服务器器修改
  signed: true, // 签名cookie
};
app.use(bodyParser());
app.use(session(SESS_CONFIG, app));

app.use(async(ctx, next) => {
  await next();
  return;
  ctx.DbHandle = DbHandle;
  console.log(ctx.url, 'ctx.urlctx.url');
  if (ctx.url.indexOf('login') > -1 || ctx.url.indexOf('decryptUser') > -1) { // 如果是登陆和解密敏感数据
    await next(); // 如果是login和decryptUser 不验证
  } else {
    // await next();
    // return;
    // console.log('session', ctx.session.userinfo);
    // if (666) {
    //   console.log();
    // } else {
    //   await next();
    // }
  // if (ctx.request.header['authorization'] === undefined) { // 第一次登陆 不用校验
  //   await next();
  //   return;
  // }
    let token = null;
    // console.log(ctx.session_key, ctx.openid, 'heahdhdhhdhdhdhdh');
    console.log(app.context.openid, app.context.session_key, '之前保存的token');
    try {
      token = jwt.verify(ctx.request.header['authorization'].split(' ')[1], config.jwt_secret);
      console.log(token, '解析后的token');
    } catch (error) {
      logsUtil.logError(ctx, error, Date.now());
      console.log('token 过期请重新登录');
      ctx.body = {
        code: 403,
        success: false,
        message: 'token 过期请重新登录'
      };
      return;
    }

    if (app.context.session_key === token.data.session_key && app.context.openid === token.data.openid) {
      await next();
    } else {
      logsUtil.logError(ctx, {}, Date.now());
      ctx.body = {
        code: 403,
        success: false,
        message: 'token 解析失败, 非本人token'
      };
    }

  }
});

app
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

// 拆分路由 lexuelearn
app
.use(apiLexuelearnRouter.routes())
.use(apiLexuelearnRouter.allowedMethods());

app.use(async(ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.set('Allow', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method === 'OPTIONS') {

      ctx.body = 200;

  }
  // ctx; // is the Context
  // ctx.request; // is a koa Request
  // ctx.response; // is a koa Response

  await next();
});

// app.use(async ctx => {
//   console.log('*******************');

//   ctx.body = 'Hello World';
// });

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
  logsUtil.logError(ctx, err, Date.now());
  if((ctx.status === 404 && err.status === undefined) || err.status === 500){
    return;
  }
});

app.listen(process.env.PORT || config.port, () => {
  console.log('成功监听端口', process.env.PORT );
});

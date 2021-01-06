const Router = require('@koa/router');
const httpRequest = require('./httpRequest');
const jwt = require("jsonwebtoken");
const jwtAuth = require("koa-jwt");
const WXBizDataCrypt = require('../util/WXBizDataCrypt');
const config = require('../config');
const router = new Router({ prefix: '/api' });
const DB = require('../db/db');
let DbHandle = new DB();
// jwt
// const jwt_secret = "lalala";

router.post('/login', async (ctx, next) => {
  // ctx.router available

  console.log(ctx.path, ctx.method, ctx.request.body, 'kkkkkkkkkkkk');
  const {code} = ctx.request.body;
  ctx.app.context.le_code = code;
  const result = await httpRequest({
    url: `https://api.weixin.qq.com/sns/jscode2session?appid=${config.APPID}&secret=${config.APP_SECRET}&js_code=${code}&grant_type=authorization_code`
  });
  // const pc = new WXBizDataCrypt(config.APPID, config.APP_SECRET);

  // const userData = pc.decryptData(encryptedData , iv);

  // console.log('解密后用户信息 data: ', userData);
  // console.log(ctx.session.userinfo, 'ctx.session.userinfo');
  // ctx.session.userinfo = result.result.session_key;
  // ctx.session.userinfo = 'hgjghgh';
  console.log(result.result, 'login response');
  ctx.app.context.session_key = result.result.session_key;
  ctx.app.context.openid = result.result.openid;
  const le_token = jwt.sign({
    data: result.result,
    // 设置 token 过期时间，⼀一2days，秒为单位
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2
  }, config.jwt_secret);
  // console.log(ctx.session.session_key, 'sessionsessionsession');
  result.token = le_token;
  ctx.body = result;
  // ctx.body = '5566';
});

router.post('/decryptUser', async (ctx, next) => {
  // ctx.router available

  console.log(ctx.path, ctx.request.body, ctx.app.context.session_key, 'hhhhhhhhh');

  const {encryptedData, iv} = ctx.request.body;
  const pc = new WXBizDataCrypt(config.APPID, ctx.app.context.session_key);

  const userData = pc.decryptData(encryptedData , iv);

  console.log('解密后用户信息 data: ', userData);
  // console.log(ctx.session.userinfo, 'ctx.session.userinfo');
  // ctx.session.userinfo = result.result.session_key;
  // ctx.session.userinfo = 'hgjghgh';

  ctx.body = 5566;
  // ctx.body = '5566';
});


router.get('/find', DbHandle.findByName);

module.exports = router;

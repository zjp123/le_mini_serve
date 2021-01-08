# 小程序后端
通过wx.login 拿到code，获取openid, 绑定openid与session的关系，session存在redis，session的最大过期时间不能超过3天，因为目前微信的session_key 有效期是三天，所以建议开发者设置的登录态有效期要小于这个值。

# wx.getUserInfo
wx.getUserInfo 这个是获取用户详细信息的 昵称 微信用户名等，它跟openid是分开的，login 已经可以完成登录，getUserInfo 只是获取额外的用户信息。

https://developers.weixin.qq.com/community/develop/doc/000c2424654c40bd9c960e71e5b009

# 改进前：
将 wx.login 和 wx.getUserInfo 绑定使用，这个是由于我们一开始的设计缺陷和实例代码导致的（wx.getUserInfo 必须通过 wx.login 在后台生成 session_key后才能调用）

# 改进后：
1.使用组件来获取用户信息

2.若用户满足一定条件，则可以用wx.login 获取到的code直接换到unionId

3.wx.getUserInfo 不需要依赖 wx.login 就能调用得到数据

# 区别：
1.API wx.getUserInfo 只会弹一次框，用户拒绝授权之后，再次调用将不会弹框；

2.组件  由于是用户主动触发，不受弹框次数限制，只要用户没有授权，都会再次弹框。

# 最佳处理：

1.调用 wx.login 获取 code，然后从微信后端换取到 session_key，用于解密 getUserInfo返回的敏感数据。

2.使用 wx.getSetting 获取用户的授权情况
 1) 如果用户已经授权，直接调用 API wx.getUserInfo 获取用户最新的信息；
 2) 用户未授权，在界面中显示一个按钮提示用户登入，当用户点击并授权后就获取到用户的最新信息。

3.获取到用户数据后可以进行展示或者发送给自己的后端。

# 注意
如果后端不需要 用户的微信账户信息  可以不用wx.getUserInfo 传给后台加密信息，解密 getUserInfo返回的敏感数据。因为wx.getUserInfo原本是在小程序前端做展示用，如果后台想保存用户的所有信息，就需要做服务端获取开放数据--https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95

# 总结
在 login 获取到 code 后，会发送到开发者后端，开发者后端通过接口去微信后端换取到 openid 和sessionKey（现在会将 unionid 也一并返回）后，把自定义登录态 3rd_session返回给前端，就已经完成登录行为了。而 login 行为是静默，不必授权的，用户不会察觉。这是最基本的登陆流程。如果后端也想拿到微信开放数据的话，那么就会多加一层步骤，就是----后台校验与解密开放数据。不管怎么样，自定义登录态 3rd_session都需要

# 开发与线上
从2018年4月30日开始，小程序与小游戏的体验版、开发版调用 wx.getUserInfo 接口，将无法弹出授权询问框，默认调用失败。正式版暂不受影响。开发者可使用以下方式获取或展示用户信息：
1、使用 button 组件，并将 open-type 指定为 getUserInfo 类型，获取用户基本信息。

# wx.getSetting wx.login 自动执行

# 是否有必要每次都走一遍login getSetting

# ctx.state  用户中间件之间的传值

# session_key 会过期 code 会过期

# 首先默默的先执行login 拿到appid 和 session_key,然后判断有没有获取用户信息权限，如果没有，就展示获取用户权限button，获取之后执行业务代码  业务代码中 判断token 是否过期，过期重新登录

# router中的ctx 不是app.use中的ctx 路由中的ctx添加属性时，只能在当前路由的ctx中用

# log问题 mongoose 问题

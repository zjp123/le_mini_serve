const Router = require('@koa/router');
const router = new Router();
router.prefix('/api/lexuelearn');
const httpRequest = require('./httpRequest');


router.get('/amaterasu/homework/recommend_homework/detail', async (ctx, next) => {
  const result = await httpRequest({
    baseURL: 'https://zkapiskfc.lexue.com',
    url: '/lexuelearn/amaterasu/homework/recommend_homework/detail',
    methods: 'post',
    header: {
      zjp: 'zjp',
      ctt: 'ctt'
    },
    data: {
      classIds: '100498',
      homework_id: 33,
      answer_record_id: ''
    }
  });
  console.log(result, ctx.path);
  ctx.body = ctx.path;
});

module.exports = router;

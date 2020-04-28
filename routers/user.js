const Router = require('koa-router');

const router = new Router({prefix: '/user'});

router.post('/login', async (ctx, next) => {
    console.log('6 ctx', ctx.request.body);
    ctx.body = {name: 'jiejie'};
    await next();
});


module.exports = router;

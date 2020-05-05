const Router = require('koa-router');
const router = new Router({prefix: '/user'});
const dbClient = require('../mongodb/client');
const ObjectId = require('mongodb').ObjectId;
const dbApi = require('../mongodb/api');
const {getSystemError, getBody, getErrorBody, getToken} = require('../utils/tool');


router.post('/login', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const userCollection = dbMemo.collection('user');
    const body = ctx.request.body;
    const [oldUserErr, oldUser] = await dbApi.findOne(userCollection,{phone: body.phone, password: body.password});
    if (oldUserErr) {
        ctx.body = getSystemError();
        return next();
    }
    if (!oldUser) {
        ctx.body = getErrorBody('22', '用户名和密码不匹配');
        return next();
    }
    ctx.body = getBody(getToken());
    next();
});

router.post('/register', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const userCollection = dbMemo.collection('user');
    const body = ctx.request.body;
    if (body.code !== 'kaikai') {
        ctx.body = {code: '11', msg: '验证码错误', data: null};
    } else {
        const [oldUserErr, oldUser] = await dbApi.findOne(userCollection,{phone: body.phone});
        if (oldUserErr) {
            ctx.body = getSystemError();
            return next();
        }
        if (oldUser) {
            ctx.body = getErrorBody('11', '用户已存在');
            return next();
        }
        const [addUserErr, addUser] = await dbApi.insertOne(userCollection,{phone: body.phone, password: body.password});
        if (addUserErr) {
            ctx.body = getSystemError();
            return next();
        }
        ctx.body = getBody(getToken());
    }
    next();
});


module.exports = router;

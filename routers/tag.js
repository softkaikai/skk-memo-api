const Router = require('koa-router');
const router = new Router({prefix: '/tag'});
const dbClient = require('../mongodb/client');
const ObjectId = require('mongodb').ObjectId;
const dbApi = require('../mongodb/api');
const {getSystemError, getBody, getErrorBody} = require('../utils/tool');


router.post('/create', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const tagCollection = dbMemo.collection('tag');
    const body = ctx.request.body;
    const [oldTagErr, oldTag] = await dbApi.findOne(tagCollection,{name: body.name});
    if (oldTagErr) {
        ctx.body = getSystemError();
        return next();
    }
    if (oldTag) {
        ctx.body = getErrorBody('22', '标签已存在');
        return next();
    }
    const [newTagErr, newTag] = await dbApi.insertOne(tagCollection, {name: body.name});
    if (newTagErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody('');
    next();
});

router.get('/find', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const tagCollection = dbMemo.collection('tag');
    const [oldTagErr, oldTag] = await dbApi.find(tagCollection);
    if (oldTagErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody(oldTag);
    next();
})


module.exports = router;

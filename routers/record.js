const Router = require('koa-router');
const router = new Router({prefix: '/record'});
const dbClient = require('../mongodb/client');
const ObjectId = require('mongodb').ObjectId;
const dbApi = require('../mongodb/api');
const {getSystemError, getBody, getErrorBody} = require('../utils/tool');


router.post('/save', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const recordCollection = dbMemo.collection('record');
    let body = ctx.request.body;
    const id = body._id;
    delete body._id;
    if (id) {
        const [newTagErr, newTag] = await dbApi.updateOne(recordCollection, {_id: ObjectId(id)}, {$set: body});
        if (newTagErr) {
            ctx.body = getSystemError();
            return next();
        }
    } else {
        const [newTagErr, newTag] = await dbApi.insertOne(recordCollection, body);
        if (newTagErr) {
            ctx.body = getSystemError();
            return next();
        }
    }
    ctx.body = getBody('');
    next();
});

router.post('/find', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const recordCollection = dbMemo.collection('record');
    const body = ctx.request.body;
    const search = {
        projectId: body.projectId,
    }
    if (body.tags && body.tags.length) {
        search.tags = {$in: body.tags || []};
    }
    if (body.title) {
        search.title = { $regex: body.title, $options: 'i' };
    }

    const [recordsErr, records] = await dbApi.find(recordCollection, search);
    if (recordsErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody(records);
    next();
})

router.get('/findById/:id', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const recordCollection = dbMemo.collection('record');
    const params = ctx.params;
    const id = params.id;

    if (!id) {
        ctx.body = getBody(null);
        return next();
    }
    const [recordErr, record] = await dbApi.findOne(recordCollection, {_id: ObjectId(id)});
    if (recordErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody(record);
    next();
})

router.get('/delete/:id', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const recordCollection = dbMemo.collection('record');
    const params = ctx.params;
    const id = params.id;

    if (!id) {
        ctx.body = getBody(null);
        return next();
    }
    const [recordErr, record] = await dbApi.deleteOne(recordCollection, {_id: ObjectId(id)});
    if (recordErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody('');
    next();
})


module.exports = router;

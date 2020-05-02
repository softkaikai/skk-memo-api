const Router = require('koa-router');
const router = new Router({prefix: '/project'});
const dbClient = require('../mongodb/client');
const ObjectId = require('mongodb').ObjectId;
const dbApi = require('../mongodb/api');
const {getSystemError, getBody, getErrorBody, getToken} = require('../utils/tool');


router.post('/create', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const projectCollection = dbMemo.collection('project');
    const body = ctx.request.body;
    const [oldProjectErr, oldProject] = await dbApi.findOne(projectCollection,{title: body.title});
    if (oldProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    if (oldProject) {
        ctx.body = getErrorBody('22', '项目标题已存在');
        return next();
    }
    const [addProjectErr, addProject] = await dbApi.insertOne(projectCollection,body);
    if (addProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody('');
    next();
});

router.post('/join', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const projectCollection = dbMemo.collection('project');
    const body = ctx.request.body;
    const [oldProjectErr, oldProject] = await dbApi.findOne(projectCollection,{title: body.title});
    if (oldProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    if (!oldProject) {
        ctx.body = getErrorBody('22', '该项目不存在');
        return next();
    }
    const users = oldProject.users || [];
    if (users.includes(body.phone)) {
        ctx.body = getErrorBody('33', '您已经加入了该项目');
        return next();
    }
    users.push(body.phone);
    const [addProjectErr, addProject] = await dbApi.updateOne(projectCollection, {title: body.title}, {$set: {users: users}});
    if (addProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody('');
    next();
});

router.get('/find', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const projectCollection = dbMemo.collection('project');
    const query = ctx.request.query;
    const [projectsErr, projects] = await dbApi.find(projectCollection, {users: {$all: [query.phone]}});
    if (projectsErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody(projects);
    next();
})

router.post('/delete/:id', async (ctx, next) => {
    const dbMemo = dbClient.db('memo');
    const projectCollection = dbMemo.collection('project');
    const params = ctx.params;
    const [oldProjectErr, oldProject] = await dbApi.findOne(projectCollection,{_id: ObjectId(params.id)});
    if (oldProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    if (!oldProject) {
        ctx.body = getErrorBody('22', '该项目不存在');
        return next();
    }
    const [delProjectErr, delProject] = await dbApi.deleteOne(projectCollection,{_id: ObjectId(params.id)});
    if (delProjectErr) {
        ctx.body = getSystemError();
        return next();
    }
    ctx.body = getBody('');
    next();
});


module.exports = router;

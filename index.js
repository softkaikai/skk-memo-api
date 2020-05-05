const Koa = require('koa');
const staticPath = require('koa-static');
const bodyParser = require('koa-bodyparser');

const UserRouter = require('./routers/user');
const UploadRouter = require('./routers/upload');
const ProjectRouter = require('./routers/project');
const TagRouter = require('./routers/tag');
const RecordRouter = require('./routers/record');
const app = new Koa();

// 设置静态文件
app.use(staticPath(__dirname, './public'));
// 设置跨域
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method === 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
app.use(bodyParser());

app.use(UserRouter.routes());
app.use(UploadRouter.routes());
app.use(ProjectRouter.routes());
app.use(TagRouter.routes());
app.use(RecordRouter.routes());


app.use(UserRouter.allowedMethods());
app.use(UploadRouter.allowedMethods());
app.use(ProjectRouter.allowedMethods());
app.use(TagRouter.allowedMethods());
app.use(RecordRouter.allowedMethods());
app.listen(3333, '0.0.0.0');
console.log('Listening on port 3333:');


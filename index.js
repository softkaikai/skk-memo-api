const Koa = require('koa');
const staticPath = require('koa-static');
const bodyParser = require('koa-bodyparser');

const UserRouter = require('./routers/user');
const UploadRouter = require('./routers/upload');
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

app.use(UserRouter.allowedMethods());
app.use(UploadRouter.allowedMethods());
app.listen(3333);
console.log('Listening on port 3333:');

/*$btn.on('click', () => {
    const formData = new FormData();
    formData.append('file', file.files[0]);
    console.log('81 file', file.files);
    $.ajax({
        url: "http://10.50.50.11:3333/upload/image",
        type: "POST",
        data: formData,
        processData: false, // 不处理数据
        contentType: false, // 不设置请求头
        cache: false,
        success: function (data) {
            console.log(data)
        }
    })
})*/

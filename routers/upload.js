const formidable = require('formidable');
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');

const router = new Router({prefix: '/upload'});

const env = process.env.NODE_ENV;

router.post('/image', async (ctx, next) => {
    const dirPath = path.resolve(__dirname, '../public/images');
    const form = formidable({
        uploadDir : dirPath
    });
    await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            const newPath = path.resolve(dirPath, './' + files.file.name);

            fs.renameSync(files.file.path, newPath);
            if (env === 'product') {
                files.file.path = 'http://localhost:3333/public/images/' + files.file.name;
            } else {
                files.file.path = 'http://localhost:3333/public/images/' + files.file.name;
            }
            ctx.set('Content-Type', 'application/json');
            ctx.status = 200;
            ctx.state = { fields, files };
            ctx.body = JSON.stringify(ctx.state, null, 2);
            resolve();
        });
    });
    await next();
});


module.exports = router;


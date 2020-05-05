const jwt = require('jsonwebtoken');
const fs = require('fs');
const {getSystemError, getBody, getErrorBody} = require('../utils/tool');

module.exports = async function(ctx, next) {
    let url = ctx.request.url;
    // 登录 不用检查
    if (url === "/user/login" || url === "/user/register") await next();
    else {
        // 规定token写在header 的 'autohrization'
        let token = ctx.request.headers["authorization"];
        // 解码
        const secret = fs.readFileSync('../secret.txt');
        let payload = await new Promise((resolve) => {
            jwt.verify(token, secret, function(err, decoded) {
                resolve(decoded)
            })
        });
        let { time, timeout } = payload;
        let data = new Date().getTime();
        if (data - time <= timeout) {
            // 未过期
            await next();
        } else {
            //过期
            ctx.body = getErrorBody('40001', 'token已过期')
        }
    }

};

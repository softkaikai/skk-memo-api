const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.getToken = function() {
    const secret = fs.readFileSync(path.resolve(__dirname, '../secret.txt'));
    return jwt.sign({ foo: 'bar' }, secret);
};

exports.getSystemError = function() {
      return {
          code: '1',
          msg: '哦豁，系统崩了',
          data: null
      }
};
exports.getBody = function(data) {
    return {
        code: '0',
        msg: '',
        data: data
    }
};
exports.getErrorBody = function(code, msg) {
    return {
        code: code,
        msg: msg,
        data: null
    }
};

var express = require('express');
var router = express.Router();
var mongod = require('mongodb-curd');
var db = 'myLemon';
var col = 'user';

/* 注册 */
router.post('/api/userlist', function(req, res, next) {
    var parms = req.body;
    var userName = parms.userName;
    var userPwd = parms.userPwd;

    if (userName) {
        mongod.find(db, col, { 'userName': userName }, function(result) {
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: '用户已存在',
                    data: result
                })
            } else {
                mongod.insert(db, col, { 'userName': userName, 'userPwd': userName }, function(result) {
                    if (!result) {
                        res.json({
                            code: 0,
                            msg: '添加失败'
                        })
                    } else {
                        res.json({
                            code: 1,
                            msg: '添加成功'
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            code: 0,
            msg: '用户名错误或密码为空'
        })
    }
});

//添加账单


module.exports = router;
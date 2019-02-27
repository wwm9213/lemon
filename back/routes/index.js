var express = require('express');
var router = express.Router();
var mongod = require('mongodb-curd');
var db = 'myLemon';
var userCol = 'user';
var billCol = 'bill';

/* 注册 */
router.post('/api/userlist', function(req, res, next) {
    var parms = req.body;
    var userName = parms.userName;
    var userPwd = parms.userPwd;

    if (userName) {
        mongod.find(db, userCol, { 'userName': userName }, function(result) {
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: '用户已存在',
                    data: result
                })
            } else {
                mongod.insert(db, userCol, { 'userName': userName, 'userPwd': userPwd }, function(result) {
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
router.post('/api/addBill', function(req, res, next) {
    var parms = req.body,
        uid = parms.uid,
        timer = parms.timer,
        type = parms.type,
        money = parms.money,
        intro = parms.intro,
        icon = parms.icon;
    mongod.insert(db, billCol, { 'uid': uid, 'timer': timer, 'type': type, 'money': money, 'intro': intro, 'icon': icon }, function(result) {
        if (!result) {
            res.json({ code: 0, msg: '添加失败' });
        } else {
            res.json({ code: 1, msg: '添加成功' });
        }
    })
});

//查找账单
router.post('/api/findBill', function(req, res, next) {
    var parms = req.body,
        uid = parms.uid,
        timer = new RegExp(parms.timer),
        page = parms.page,
        limit = parms.limit;
    mongod.find(db, billCol, { 'uid': uid, 'timer': timer }, function(result) {
        if (!result) {
            res.json({ code: 0, msg: '查找失败' });
        } else {
            res.json({ code: 1, msg: '查找成功', data: result });
        }
    }, {
        skip: (page - 1) * limit,
        limit: limit
    })
})

module.exports = router;
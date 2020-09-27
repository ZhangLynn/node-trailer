/**
 * @author: zhangling
 * @date: 2020/9/20
 * @description:
 */
// 服务器启动文件
const Koa = require('koa')
const app = new Koa();
const mongoose = require('mongoose')

const { connect, initSchema } = require('./database/init')

;(async () => {
    try {
        await connect()

        // 数据库初始化
        initSchema()

        // 启动子进程脚本 爬数据
        // require('./tasks/api')


        app.use(async (ctx, next) => {
            ctx.body = 'success'
        })
        app.listen(9107)
    } catch (e) {
        console.log(e)
    }


})()



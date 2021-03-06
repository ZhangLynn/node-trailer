/**
 * @author: zhangling
 * @date: 2020/9/20
 * @description:
 */
// 服务器启动文件
const Koa = require('koa')
const app = new Koa();

const R = require('ramda')
const MIDDLEWARES = ['common', 'router']

const { connect, initSchema } = require('./database/init')
const { resolve } = require('path')

// require('./test')

// 引入中间件
const useMiddlewares = app => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

;(async () => {
    try {

        await connect()

        // 数据库初始化
        initSchema()

        // 启动子进程脚本 爬数据
        // require('./crawler/trailer-detail')

        async function start() {
            const app = new Koa()
            await useMiddlewares(app)

            // app.use(async ctx => {
            //     ctx.body = 'Hello Ling';
            // });
            // app.use(bodyParser())
            app.listen('9107')

            // app.listen(process.env.NODE_ENV === 'production' ? process.env.env_production.PORT : '9107')
        }

        start()

    } catch (e) {
        console.log(e)
    }
})()




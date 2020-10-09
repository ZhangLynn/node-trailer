/**
 * @author: zhangling
 * @date: 2020/10/9
 * @description:
 */
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'

export const addBodyParser = app => {
    app.use(bodyParser())
}

export const addLogger = app => {
    app.use(logger())
}

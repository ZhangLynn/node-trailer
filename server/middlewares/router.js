/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */

const { Route } = require('../lib/decorator')
const { resolve } = require('path')

export const router = app => {
    const apiPath = resolve(__dirname, '../routes')
    const router = new Route(app, apiPath)

    router.init()
}

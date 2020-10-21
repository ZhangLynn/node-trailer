/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */
const Router = require('koa-router')
const { resolve } = require('path')
const glob = require('glob')
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()

const R = require('ramda')

const _ = require('lodash')
const isArray = c => _.isArray(c) ? c : [c]

export class Route {
    // APP 是实例 apipath是所有route路径
    constructor(app, apiPath) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }

    init() {
        glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path

            // router.get('/hello/:name', async (ctx, next) => {
            //     var name = ctx.params.name; // 获取请求参数
            //     ctx.response.body = `<h5>Hello, ${name}!</h5>`;
            // });
            // todo controllers 是routes里面定义好的方法 命中路由后 获取数据库数据且返回 如同上面的异步函数
            this.router[conf.method](routerPath, ...controllers)
            // app使用router的常规方法
            this.app.use(this.router.routes())
            this.app.use(this.router.allowedMethods())
        }
    }
}



export const controller = path => target => (
    // 交给原型的前缀属性 我们希望它是唯一的
    // 这里没看懂 设置整个电影路由的前缀
    target.prototype[symbolPrefix] = path
)

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)
    // 对象中总是有原型链的键值 当我们想表示纯粹的集合时
    routerMap.set({
        target: target,
        ...conf,
    }, target[key])
}

export const get = path => router({
    method: 'get',
    path
})

export const post = path => router({
    method: 'post',
    path
})

export const put = path => router({
    method: 'get',
    path
})

export const del = path => router({
    method: 'delete',
    path
})

export const use = path => router({
    method: 'get',
    path
})

export const all = path => router({
    method: 'get',
    path
})

const changeToArr = R.unless(
    R.is(isArray),
    R.of
)

const decorate = (args, middleware) => {
    let [target, key, descriptor] = args

    target[key] = isArray(target[key])
    target[key].unshift(middleware)

    return descriptor
}

const convert = middleware => (...args) => decorate(args, middleware)

export const auth = convert(async (ctx, next) => {
    if (!ctx.session.user) {
        return (
            ctx.body = {
                success: false,
                code: 401,
                message: '登录失效'
            }
        )
    }
})

export const admin = roleExpected => convert(async (ctx, next) => {
    const { role } = ctx.session.user

    if (!role || role !== 'admin') {
        return (
            ctx.body = {
                success: false,
                code: 403,
                message: '没有权限'
            }
        )
    }
})

export const required = rules => convert(async(ctx, next) => {
    let errors = []
    
    const checkRules = R.forEachObjIndexed((
        (value, key) => {
            errors = R.filter(i => {
                return !value.includes(i)

                // return !R.has(i, ctx, ctx.request[key])
            })(value)
        }
    ))

    checkRules(rules)

    if (errors.length) {
        return ctx.body = {
            success: false,
            code: 412,
            message: `${errors.join(',')} is required`
        }
    }

    await next()
})

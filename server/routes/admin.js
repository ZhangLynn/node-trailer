/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */
import {
    controller,
    get,
    post,
    del,
    auth,
    admin,
    required,
} from '../lib/decorator'

import {
    checkPassword,
    checkUser,
    registerUser
} from '../service/user'

import {
    getAllMovies,
    findOneAndRemoveMovie
} from "../service/movie"

// 让所有路由都能被合理的拆分

@controller('/admin')
export class adminController {
    // list 做一个auth验证 后面不用做了?

    @get('/movie/list')
    @auth
    @admin('admin')
    async getMovieList(ctx) {
        const movies = await getAllMovies()

        return ctx.body = {
            movies,
        }
    }

    @del('/movie/delete')
    // @required({
    //     query: ['id']
    // })
    async deleteMovie(ctx) {
        const { id } = ctx.query

        const result = await findOneAndRemoveMovie(id)

        if (result) {
            ctx.body = {
                success: true,
                message: '删除成功'
            }
        } else {
            ctx.body = {
                success: false,
                message: '删除失败'
            }
        }
    }

    @post('/register')
    @required({
        body: ['email', 'username', 'password']
    })
    async register(ctx) {

        const { email, password, username } = ctx.request.body

        const findUser = await checkUser(email, username)

        if (findUser) {
            return ctx.body = {
                success: false,
                message: '用户名或者邮箱已重复'
            }
        }

        const insertedUser = await registerUser({
            email,
            password,
            username
        })

        return ctx.body = {
            success: true,
            message: '注册成功',
            data: insertedUser
        }
    }


    @post('/login')
    @required({
        body: ['email', 'password']
    })
    async login(ctx) {
        const { email, password } = ctx.request.body
        const matchData = await checkPassword(email, password)

        if (!matchData.user) {
            return ctx.body = {
                success: false,
                message: '用户不存在'
            }
        }

        if (matchData.match) {
            ctx.session.user = {
                _id: matchData.user.id,
                email: matchData.user.email,
                username: matchData.user.username,
                role: matchData.user.role
            }

            return ctx.body = {
                success: true,
            }
        }

        return ctx.body = {
            success: false,
            message: '密码或者账号不正确'
        }
    }
}


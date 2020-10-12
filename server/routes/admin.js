/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */
import {
    controller,
    get,
    post,
    auth,
    admin,
    required,
} from '../lib/decorator'

import {
    checkPassword
} from '../service/user'

import {
    getAllMovies
} from "../service/movie"

// 让所有路由都能被合理的拆分

@controller('/admin')
export class adminController {
    @get('/list')
    @auth
    @admin('admin')
    async getMovieList(ctx) {
        const movies = await getAllMovies()

        return ctx.body = {
            movies,
        }
    }

    @post('/login')
    @required({
        body: ['email', 'password', 'abc']
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


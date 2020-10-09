/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */
import {
    getRelativeMovies,
    getMovie,
    getMovieDetail
} from "../service/movie"

import {
    controller,
    get,
    post
} from '../lib/decorator'

import {
    checkPassword
} from '../service/user'

// 让所有路由都能被合理的拆分

@controller('/admin')
export class userController {
    @post('/login')
    async checkPassword(ctx) {
        console.log(ctx)
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


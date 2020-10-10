/**
 * @author: zhangling
 * @date: 2020/10/5
 * @description:
 */
import {
    getRelativeMovies,
    getAllMovies,
    getMovieDetail
} from "../service/movie"

import {
    controller,
    get
} from '../lib/decorator'


// 让所有路由都能被合理的拆分

@controller('/api/v0/movies')
export class movieController {

    @get('/')
    async getAllMovies(ctx, next) {
        const { type, year } = ctx.query
        const movies = await getAllMovies(type, year)

        ctx.body = {
            movies
        }
    }

    @get('/:id')
    async getMovieDetail(ctx, next) {
        // query 和 params的不同
        console.log(2)
        const { id } = ctx.params.id
        const movie = await getMovieDetail(id)
        const relativeMovies = await getRelativeMovies(move)

        ctx.body = {
            data: {
                movie,
                relativeMovies
            },
            success: true
        }
    }
}


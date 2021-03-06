/**
 * @author: zhangling
 * @date: 2020/10/7
 * @description:
 */
// 这里也是一个子进程
const cp = require('child_process')
const { resolve } = require('path')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {
    const movies = await Movie.find({})


    const script = resolve(__dirname, '../crawler/trailer-detail')
    const child = cp.fork(script, []);
    let invoked = false;

    child.on('error', err => {
        if (invoked) return

        invoked = true

        console.log(err)
    })

    child.on('exit', code => {
        if (invoked) return

        invoked = true

        let err = code === 0 ? null : new Error(`exit code ${code}`)
    })

    child.on('message', data => {
        let result = data.result

        result.forEach(async (item) => {
            let movie = await Movie.findOne({
                doubanId: item.doubanId
            })

            if (!movie) {
                movie = new Movie(item)
                await movie.save()
            }
        })
    })
})()

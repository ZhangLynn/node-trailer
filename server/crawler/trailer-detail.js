/**
 * @author: zhangling
 * @date: 2020/10/7
 * @description:
 */
const puppeteer = require('puppeteer')
const chromeFinder = require('chrome-finder')
const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const Movie = mongoose.model('Movie')

const url = 'https://movie.douban.com/subject/'
// todo
const sleep = time => new Promise(resolve => {
        setTimeout(resolve, time)
    })

;(async () => {
    // const browser = await puppeteer.launch({
    //     args: ['--no-sandbox'],
    //     dumpio: false
    // })


    const movies = await Movie.find({})

    // console.log(movies)
    // movies.map(async m => {
    //     m.tags = [];
    //     m.category = []
    //     await m.save()
    // })
    // return
let preloadHref = ''
    // movies.map(async item => {
    //     if (item.doubanId && item._id) {
    //         const doubanId = item.doubanId
            const doubanId = '34947626'
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            await page.goto(url + doubanId + '/', {
                waitUntil: 'networkidle2'
            })

            await sleep(2000)


            // const preloadHref = await page.$eval('a[rel=v:directedBy]', el => el.href);
            // console.log(preloadHref)
            const movieData = await page.evaluate(() => {
                const $ = window.$
                let rating = $('#interest_sectl')
                const average = rating.find('.rating_num').text();
                const numRater = rating.find('.rating_people').text();
                const info = $('#info')
                preloadHref = document.querySelector("a[rel='v:directedBy']");
                let tags = $('.tags-body a');
                let tagsText = [],
                    year = 0;
                if (tags.length >= 1) {
                    tags.each((index, item) => {
                        let it = $(item);
                        tagsText.push(it.text())
                        // if (typeof parseInt(it.text()) === 'number') {
                        //     year = it.text()
                        // }
                    })
                }

                let data = {
                    tags: tagsText
                }

                return preloadHref;
            })
            console.log(movieData)

            return
            const movie = await Movie.findOne({
                doubanId
            })

            for (let i = 0; i < movieData.tags.length; i++) {
                const item = movieData.tags[i]

                let cat = await Category.findOne({
                    name: item
                })
                if (!cat) {
                    cat = new Category({
                        name: item,
                        movies: [movie._id]
                    })
                } else {
                    if (cat.movies.indexOf(movie._id) === -1) {
                        cat.movies.push(movie._id)
                    }
                }

                await cat.save()

                // 数组的存入每次都要check是否重复值
                if (!movie.category) {
                    movie.category.push(cat._id)
                } else {
                    if (movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id)
                        movie.tags.push(cat.name)
                    }
                }

                await movie.save()
            }
            browser.close()
    //     }
    //
    // })
    // process.send({result})
    // process.exit(0)
})()

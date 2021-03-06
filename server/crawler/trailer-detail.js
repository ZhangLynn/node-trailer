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
    const movies = await Movie.find({})

    if (movies.length === 0) return

    const browser = await puppeteer.launch({headless: true});

    let preloadHref = '',
        count = 0;
    movies.map(async item => {
        if (item.doubanId && item._id) {
            const doubanId = item.doubanId

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

            await page.goto(url + doubanId + '/', {
                waitUntil: 'networkidle2',
                timeout: 0
            })

            await sleep(2000)

            // const preloadHref = await page.$eval('a[rel=v:directedBy]', el => el.href);
            // console.log(preloadHref)
            const movieData = await page.evaluate(() => {
                const $ = window.$
                let rating = $('#interest_sectl')
                const average = rating.find('.rating_num').text();
                const numRater = rating.find('.rating_people span[property="v:votes"]').text();

                const info = $('#info')
                const director = info.find("a[rel='v:directedBy']").text();
                const initialReleaseDate = info.find("span[rel='v:initialReleaseDate']").text();

                const types = $('#info span[property="v:genre"]')
                let typesText = [];
                if (types.length >= 1) {
                    types.each((index, item) => {
                        let it = $(item);
                        typesText.push(it.text())
                    })
                }

                let tags = $('.tags-body a');
                let tagsText = [];
                if (tags.length >= 1) {
                    tags.each((index, item) => {
                        let it = $(item);
                        tagsText.push(it.text())
                    })
                }

                let movieData = {
                    tags: tagsText,
                    types: typesText,
                    director,
                    average,
                    numRater,
                    initialReleaseDate,
                }

                return movieData;
            })

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

            count++
            if (count === movies.length) {
                browser.close()
            }
        }
    })
    // process.send({result})
    // process.exit(0)
})()

/**
 * @author: zhangling
 * @date: 2020/9/27
 * @description:
 */
const superagent = require('superagent')
const api = 'https://movie.douban.com/j/search_subjects'

module.exports = pageStart => {
    return new Promise((resolve, reject) => {
        superagent
            .get(api)
            .query({
                pageStart,
                'type': 'tv',
                'tag': '日本动画',
                'sort': 'recommend',
                'page_limit': 20
            })
            .type('form')
            .accept('application/json')
            .end((err, res) => {
                if (err) reject(err);
                resolve(res)
            })
    })
}

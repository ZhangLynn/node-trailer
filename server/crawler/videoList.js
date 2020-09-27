/**
 * @author: zhangling
 * @date: 2020/9/25
 * @description:
 */
const rp = require('request-promise-native')  //http的request获取数据

const url = 'https://api.bilibili.com/x/web-interface/archive/stat'

const sleep = time => new Promise((resolve, reject) => {
    setTimeout(resolve, time)
})

const fetchVideo = async (id) => {
    const res = await rp(`${url}?aid=${id}`)

    let body
    try {
        body = JSON.parse(res).data ? JSON.parse(res).data : null
    } catch (error) {
        console.log(error)
    }

    return body
}
;(async () => {
    const result = [];
    const interval = 1;
    const start = process.argv[2] * interval;
    for (let i = start; i <= start + interval; i++) {
        await sleep(600)

        const video = await fetchVideo(i);

        result.push(video)
    }
    console.log(process.argv[2])
    process.send({
        result: result
    })
    process.exit(0)
})()

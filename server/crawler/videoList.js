/**
 * @author: zhangling
 * @date: 2020/9/25
 * @description:
 */
const rp = require('request-promise')  //http的request获取数据
const request = require('request')
const url = 'https://api.bilibili.com/x/web-interface/archive/stat'

const sleep = time => new Promise((resolve, reject) => {
    setTimeout(resolve, time)
})


const fetchVideo = async (id) => {
    const ipUrl = 'http://118.25.93.211:16688/random?protocol=http&nick_type=2'

    const ip = await rp.get(ipUrl);

    const proxyRequest = request.defaults({ proxy: ip });

    proxyRequest(`${url}?aid=${id}`, (err, res, body) => {
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err)
            } else {
                let data
                data = JSON.parse(body) && JSON.parse(body).data;

                resolve(data)
            }
        })
    })

    // const res = await rp({
    //     url: `${url}?aid=${id}`
    // })

}

;(async () => {
    const result = [];

    const interval = 1;
    const start = parseInt(process.argv[2]);
    const end = parseInt(process.argv[3]);

    for (let i = start; i < end; i++) {
        await sleep(1000)
        const video = await fetchVideo(i);
        result.push(video)
    }

    process.send({
        result: result
    })

    process.exit(0)
})()

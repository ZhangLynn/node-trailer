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
    const data = await rp(`${url}?aid=${id}`, {
        proxy: ip,
    })
    console.log(data)
    return data;
    const proxyRequest = request.defaults({
        proxy: ip,
        timeout: 2000
    });

    const http = (url) => {
        return new Promise((resolve, reject) => {
            proxyRequest(url, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    let data
                    data = JSON.parse(body) && JSON.parse(body).data;
                    resolve(data)
                }
            })
        })
    }
    return http(`${url}?aid=${id}`)
        // const res = await rp({
    //     url: `${url}?aid=${id}`
    // })

}

const httpVideo = async (id) =>  {

    const res = await rp(`${url}?aid=${id}`)

    let body

    try {
        body = JSON.parse(res).data || null
    } catch (error) {
        console.log(error)
    }

    return body
}

;(async () => {
    const result = [];

    const interval = 1;
    const start = parseInt(process.argv[2]);
    const end = parseInt(process.argv[3]);

    for (let i = start; i < end; i++) {
        await sleep(5000)

        const video = await httpVideo(i);
        result.push(video)
    }

    process.send({
        result: result
    })

    process.exit(0)
})()

/**
 * @author: zhangling
 * @date: 2020/9/25
 * @description:
 */
const mongoose = require('mongoose')
const spider = require('../crawler/doubanCartoon')
;(async () => {

    let invoked = false;

    process.on('error', err => {
        if (invoked) return

        invoked = true

        console.log(err)
    })

    process.on('exit', code => {
        if (invoked) return

        invoked = true

        let err = code === 0 ? null : new Error(`exit code ${code}`)
    })

    process.on('message', params => {
        let num = 0;
        const pageNum = 20;
        const maxPageStart = params[1] * 20 - 1;
        // console.log(pageNum * (num + params[0]))
        // return

        while (pageNum * (num + params[0]) <= maxPageStart) {
            let pageStart = pageNum * (num + params[0]);

            (async () => {
                const res = await spider(pageStart);
                console.log(res)
            })()

            num += params[1]
        }
    })
})()

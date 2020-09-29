/**
 * @author: zhangling
 * @date: 2020/9/25
 * @description:
 */
const mongoose = require('mongoose')
const spider = require('../crawler/doubanCartoon')
const Cartoon = mongoose.model('Cartoon')

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
        const pageNum = 1;
        const maxPageStart = params[1] * pageNum - 1;

        while (pageNum * (num + params[0]) <= maxPageStart) {
            let pageStart = pageNum * (num + params[0]);

            (async () => {
                const res = await spider(pageStart);
                const subjects = JSON.parse(res.text).subjects || [];
                subjects.map(async item => {
                    let cartoon = await Cartoon.findOne({
                        doubanId: item.id
                    })
                    if (!cartoon) {
                        cartoon = new Cartoon(item)
                        await cartoon.save()
                    }
                })
            })()

            num += params[1]
        }
    })
})()

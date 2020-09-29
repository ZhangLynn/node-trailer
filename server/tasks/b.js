/**
 * @author: zhangling
 * @date: 2020/9/20
 * @description:
 */
// 子进程做脏活累活
const cp = require('child_process')
const { resolve } = require('path')
// const mongoose = require('mongoose')
// const Video = mongoose.model('Video')

;(async () => {
    const script = resolve(__dirname, '../crawler/videoList')
    const child = cp.fork(script, [1, 10]);

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
            if (item) {
                // let video = await Video.findOne({
                //     aid: item.aid
                // })
                // if (!video) {
                //     video = new Video(item)
                //     await video.save()
                // }
            }
        })
    })
})()

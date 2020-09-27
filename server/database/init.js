/**
 * @author: zhangling
 * @date: 2020/9/21
 * @description:
 */
const mongoose = require('mongoose');
const { resolve } = require('path')
const db = 'mongodb://localhost/douban-trailer'
const glob = require('glob')

// 重置promise
mongoose.Promise = global.Promise

exports.initSchema = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
    let maxConnectTimes = 0;

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(db);

        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++;

            if (maxConnectTimes < 5 ) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
        })

        mongoose.connection.once('open', () => {
            console.log('启动了')
            // const Person = mongoose.model('Person', { name: String })
            // const person = new Person({ name: 'ling' })
            // person.save().then(() => {
            //     console.log('wa')
            // })
            resolve()
        })
    })
}

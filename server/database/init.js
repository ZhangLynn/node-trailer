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

exports.initAdmin = async () => {
    const User = mongoose.model('Uesr')
    const admin = await User.findOne({
        username: 'lynn'
    })

    if (!admin) {
        const user = new User({
            username: 'lynn',
            email: 'zl8312070@sina.com',
            password: '123456',
            role: 'admin'
        })
        await user.save()
    }
}

exports.connect = () => {
    let maxConnectTimes = 0;

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

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
            resolve()
        })
    })
}

/**
 * @author: zhangling
 * @date: 2020/9/23
 * @description:
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types
const moment = require('moment')

const videoSchema = new Schema({
    aid: {
        unique: true,
        type: Number
    },
    bvid: {
        unique: true,
        type: String
    },

    view: Number,
    danmaku: Number,
    reply: Number,
    favorite: Number,
    coin: Number,
    share: Number,

    like: Number,
    nowRank: Number,
    hisRank: Number,
    noReprint: Number,
    copyright: Number,
    argueMsg: String,
    evaluation: String,

    // 使用Mixed 可以存放字符串 也可以存放字符串的数组
    cid: Mixed,

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

videoSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
    } else {
        this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
    }
    next()
})

mongoose.model('Video', videoSchema)

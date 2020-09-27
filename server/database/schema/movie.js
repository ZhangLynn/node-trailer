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
    doubanId: {
        unique: true,
        type: String
    },
    // todo
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],

    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    rawTitle: String,
    movieTypes: [String],

    // 使用Mixed 可以存放字符串 也可以存放字符串的数组
    pubDate: Mixed,
    year: Number,

    videoKey: String,
    posterKey: String,
    coverKey: String,

    tags: [String],

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

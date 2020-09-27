/**
 * @author: zhangling
 * @date: 2020/9/23
 * @description:
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types

const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    // 指定数组内对象的格式 引用指向model Movie
    movies: [{
        type: ObjectId,
        ref: 'Movie'
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

mongoose.model('Category', categorySchema)

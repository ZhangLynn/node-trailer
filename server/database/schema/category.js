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

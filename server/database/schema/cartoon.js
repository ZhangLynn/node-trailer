/**
 * @author: zhangling
 * @date: 2020/9/27
 * @description:
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed, ObjectId } = Schema.Types
const moment = require('moment')

const cartoonSchema = new Schema({
    doubanId: {
        unique: true,
        type: Number
    },
    name: {
        unique: true,
        type: String
    },
    url: String,
    cover: String,
    is_new: Boolean,
    playable: Boolean,
    rate: Number
})

mongoose.model('Cartoon', cartoonSchema)

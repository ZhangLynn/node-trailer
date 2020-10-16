/**
 * @author: zhangling
 * @date: 2020/10/6
 * @description:
 */
require("babel-core/register")({
    presets: ['es2015', 'stage-0']
})
require('babel-polyfill')
require('./server/index.js')

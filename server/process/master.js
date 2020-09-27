/**
 * @author: zhangling
 * @date: 2020/9/25
 * @description:
 */
const cluster = require('cluster')
const cpuNum = require('os').cpus().length
const { resolve } = require('path')


cluster.setupMaster({
    exec: resolve(__dirname, './work.js'),
    args: ['--use', 'http']
})

for (let i = 0; i < cpuNum; ++i) {
    let work = cluster.fork();
    work.send([i, cpuNum]);
}
cluster.disconnect();

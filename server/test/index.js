/**
 * @author: zhangling
 * @date: 2020/10/19
 * @description:
 */



    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            // console.log(i)
        }, 1000)
    }

    // 共用一个上下文 i 被改变了


    // 运用函数保存变量现场
    var arr = []
    for (var i = 0; i < 3; i++) {
        // arr[i] = (function c(index) {
        //     return index
        // })(i)
        // 在闭包里 有自己的执行上下文
        arr[i] = function() {
            return i
        }
    }

console.log(arr[0]())


let obj = null
console.log(JSON.stringify(obj))

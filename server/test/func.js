/**
 * @author: zhangling
 * @date: 2020/10/19
 * @description:
 */

/**
 * 1. 全局对象 window or global
 * 2. 执行环境 栈结构 后进先出
 * 3. 执行环境
 *      创建 变量提升 var 定义变量 在var之前读到undefined 如果是const let 就是语法错误
 *      执行 变量赋值
 * 4. 回收机制 标记回收
 *      给全局对象加属性
 *      事件回调
 *      闭包
 *
 */

/**1. 闭包
 *      保存变量现场
 *      保存外部函数值 即使本函数已经被返回
 *      更新外部函数值
 * 2. this
     * 默认绑定 undefined 全局对象window
     * 隐式绑定 调用对象
     * 强绑定
     * new 绑定
     * 箭头函数绑定 指向外层作用域
 * 3. apply 数组 call bind
    * https://muyiy.cn/blog/3/3.3.html#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF
*/

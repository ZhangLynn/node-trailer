/**
 * @author: zhangling
 * @date: 2020/10/19
 * @description:
 */


/**
 *  es5
 *  让子类原型对象prototype=父类实例
 *  实例用__proto__访问构造函数的原型对象
 *  instanceof检测实例和构造函数的prototype是否为统一指针
 *  es6
 *  class和extends
 *  子类在constructor里面调用super (调用父类的constructor) 相当于执行父类.call(this)
 *  子类没有this 以此继承父类this 然后添加自己属性
 *
 *
 *  每个对象拥有一个原型对象，通过 __proto__ 指针指向上一个原型 ，
 *  并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null。
 *  这种关系被称为原型链 (prototype chain)，通过原型链一个对象会拥有定义在其他对象中的属性和方法。
 *
 *
 */

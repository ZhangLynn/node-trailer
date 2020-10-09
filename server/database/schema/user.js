/**
 * @author: zhangling
 * @date: 2020/9/23
 * @description:
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
    username: {
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    lockUntil: Number,
    loginAttempts: {
        default: 0,
        type: Number
    },
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

userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
    } else {
        this.meta.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
    }
    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(this.password, salt, (error, hash) => {
            this.password = hash
            next()
        })
    })
})

userSchema.method({
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (err) reject(err)

                resolve(isMatch);
            })
        })
    },
    incLoginAttempts: () => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if (err) return reject(err)
                    resolve(true)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set({
                        lockUntil: new Date() + LOCK_TIME
                    })
                }
                this.update(updates, (err) => {
                    if (err) return reject(err)
                    resolve(true)
                })
            }
        })
    }
})


mongoose.model('User', userSchema)

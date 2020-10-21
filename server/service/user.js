const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (email, password) => {
  let match = false;

  let user = await User.findOne({ email })

  if (user && !user.isLocked) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}

export const checkUser = async(email, username) => {
  let match = false;

  const emailCheck = await User.findOne({ email })
  const usernameCheck = await User.findOne({ username })

  if (emailCheck || usernameCheck) match = true

  return match
}

export const registerUser = async(data) => {
  const user = new User(data)

  const insertedUser = await user.save()

  return insertedUser
}

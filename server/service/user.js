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

  const emailCheck = await User.find({ email })
  const usernameCheck = await User.find({ username })

  if (emailCheck || usernameCheck) match = true

  return {
    match
  }
}

export const registerUser = async(email, username, password) => {
  const user = {
    username,
    email,
    password,
  }

  const insertedUser = await User.insertOne(user)

  return {
    user: insertedUser
  }
}

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // this ensures the uniqueness of the username
    minLength: 3,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]+$/.test(v) // allows only alphanumeric characters
      },
      message: props => `${props.value} is not a valid username!`,
    },
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

export default User

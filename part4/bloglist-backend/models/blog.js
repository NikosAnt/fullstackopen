import { Schema, model } from 'mongoose'

const blogSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  url: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [String]
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default model('Blog', blogSchema)

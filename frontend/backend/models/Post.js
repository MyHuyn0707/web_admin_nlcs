const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    name: {
      type: String,
    },
    scientificName: {
      type: String,
    },
    description: {
      type: String,
    },
    medicalInfo: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    collection: 'posts',
  }
);

module.exports = mongoose.model('Post', postSchema);

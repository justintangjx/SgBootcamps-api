const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [100, "Name cannot be more than 50 characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description!"],
    maxlength: [500, "Description cannot be more than 500 characters"]
  },
  website: {
    type: String,
    required: [true, "Please add a website"],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS"
    ]
  },
  phone: {
    type: String,
    maxlength: [11, "Phone number cannot be more than 8 characters"]
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email"
    ]
  },
  address: {
      type: String,
      required: [true, 'Please add an address']
  },
  // location: {
  //     type: {
  //         type: String,
  //         enum: ['Point'],
  //         required: true
  //     },
  //     coordinates: {
  //         type: [Number],
  //         index: '2dsphere',
  //         required: true
  //     },
  //     formattedAddress: String,
  //     street: String,
  //     postalCode: String,
  // },
  careers: {
      type: [String],
      required: true,
      enum: [
          'Web Development',
          'Mobile Development',
          'Data Science',
          'UI/UX',
          'Product Management',
          'Digital Marketing',
          'Blockchain',
          'Others'
      ]
  },
  averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot be more than 10'],
  },
  averageCost: Number,
  photo: {
      type: String,
      default: 'no-photo.jpg'
  },
  jobAssistance: {
      type: Boolean,
      default: false
  },
  jobPlacementRate: Number,
  createdAt: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);

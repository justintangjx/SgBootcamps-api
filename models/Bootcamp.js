const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geoCoder");

const BootcampSchema = new mongoose.Schema(
  {
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
      required: [true, "Please add an address"]
    },
    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      postalCode: String,
      country: String
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "UI/UX",
        "Product Management",
        "Digital Marketing",
        "Blockchain",
        "Others"
      ]
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot be more than 10"]
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    // jobPlacementRate: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
    // user: {
    //   type: mongoose.Schema.ObjectID,
    //   ref: 'Bootcamp',
    //   required: true
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//create bootcamp slug from the name
BootcampSchema.pre("save", function(next) {
  console.log("Slugify ran", this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//geocode and create location field
BootcampSchema.pre("save", async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    postalCode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // do not save address in DB
  this.address = undefined;
  next();
});

// cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  console.log(`courses being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
} )

module.exports = mongoose.model("Bootcamp", BootcampSchema);

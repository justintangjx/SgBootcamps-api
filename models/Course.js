const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add duration in weeks']
    },
    tuitionCost: {
        type: Number,
        required: [true, 'Please add a cost in $']
    },
    minimumSkillRequired: {
        type: String,
        // required: [false],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    fullTimeBasis: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Course', CourseSchema);

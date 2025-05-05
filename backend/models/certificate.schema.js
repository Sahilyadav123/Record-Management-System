const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    certificateUrl: {
        type: String,
        required: true,
        default: "",
        trim : true
    },
    issueDate: {
        type: Date,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: "",
        trim : true
    }
});

module.exports = mongoose.model("certificate", certificateSchema);
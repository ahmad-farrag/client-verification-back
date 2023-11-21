const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    value:{
        type: String,
        required: true,
    }
})

exports.Project = mongoose.model('Project', projectSchema);
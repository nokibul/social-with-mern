const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        likes: Array,
        default: [],
    },
},{ timestamps: true }
);

module.exports = mongoose.model("Post",UserSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    image:{
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
}, {
    timestamps: true,
});


const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
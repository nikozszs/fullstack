import mongoose from 'mongoose';

const CommetnSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    }, {
        timestamps: true,
    },
);

export default mongoose.model('Comment', CommetnSchema)
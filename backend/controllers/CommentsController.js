import CommentModel from '../models/Comments.js';
import PostModel from '../models/Post.js';

export const getRandomComments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5
        const comments = await CommentModel.find()
            .populate('user', ['fullName', 'avatarUrl'])
            .populate('post', ['title'])
            .limit(limit)
            .exec()

        res.json(comments)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить комментарии',
        })
    }
}

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params

        const comments = await CommentModel.find({ post: postId})
            .populate('user', ['fullName', 'avatarUrl'])
            .exec()

        res.json(comments)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить комментарии',
        })
    }
}

export const createComment = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            post: req.body.postId,
            user: req.userId, 
        })
        const comment = await doc.save()

        await PostModel.findByIdAndUpdate(
            req.body.postId, 
            { $inc: { commentsCount: 1}}
        )

        const populatedComment = await CommentModel.findById(comment._id)
            .populate('user')
            .exec()

        res.json(populatedComment)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось создать комментарий',
        })
    }
}


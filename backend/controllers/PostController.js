import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate({ path: "user", select: ["name", "avatar"] })
            .exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статью"
        })
    }
}

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить теги"
        })
    }
}

export const getPostsByTag = async (req, res) => {
    try {
        const tagName = req.params.tagName;
        const posts = await PostModel.find({ tags: tagName }).populate('user').exec()
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось найти посты по тегу"
        })
    }
}

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({ 
            viewsCount: { $gte: 50 } 
        })
        .populate('user')
        .sort({ viewsCount: -1 })
        .exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить популярные статьи"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        
        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate('user')

        if (!doc) {
            return res.status(404).json({
                message: "Статья не найдена"
            })
        }

        res.json(doc)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статью"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        
        const doc = await PostModel.findOneAndDelete({
            _id: postId
        })

        if (!doc) {
            return res.status(404).json({
                message: "Статья не найдена"
            })
        }
        
        res.json({
            success: true
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось удалить статью"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.userId,
            tags: req.body.tags.split(','),
        })
        
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить статью"
        })
    }
}
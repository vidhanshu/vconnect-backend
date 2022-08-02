const Router = require('express').Router;
const Post = require('../models/post');
const auth = require('../middleware/auth');
const router = new Router();

//POST 
//api/post/create
router.post('/create', auth, async (req, res) => {
    try {
        const { description, image } = req.body;
        const user = req.auth._id;
        const post = new Post({ description, image, owner: user });
        await post.save();
        res.send(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

//PATCH
//api/post/update
router.patch('/update/:id', auth, async (req, res) => {
    try {
        const { description, image } = req.body;
        const post = await Post.findById(req.params.id);
        if (post.owner != req.auth._id) {
            return res.status(401).json({ error: 'Not authorized' });
        }
        post.description = description;
        post.image = image;
        await post.save();
        res.send(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.patch('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.auth._id)) {
            return res.status(400).json({ error: 'Already liked' });
        }
        post.likes.push(req.auth._id);
        await post.save();
        res.send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET
//api/post/all
router.get('/all', auth, async (req, res) => {
    const query = req.query;
    const limit = {};
    const sort = {};
    const skip = {};

    if (query.limit) {
        limit.limit = parseInt(query.limit);
    }
    if (query.sortBy) {
        const ar = query.sortBy.split(':');
        console.log(ar);
        sort[ar[0]] = ar[1] === 'desc' ? -1 : 1;
        console.log(sort);
    }
    if (query.skip) {
        skip.skip = parseInt(query.skip);
    }

    try {
        const posts = await Post.find({}, {}, { ...limit, sort, ...skip });
        res.send(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
module.exports = router;
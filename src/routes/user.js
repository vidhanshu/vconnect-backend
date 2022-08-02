const Router = require('express').Router;
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new Router();

router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user.getPublicUser());
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})
module.exports = router;
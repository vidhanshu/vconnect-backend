const Router = require('express').Router;
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = Router();

//POST
router.post('/register', async (req, res) => {
    const { name, password, email, country } = req.body;
    try {
        const user = new User({ name, email, password, country });
        let userWithToken = user.generateUserWithToken();
        await userWithToken.user.save();
        res.status(201).send({ ...userWithToken, user: userWithToken.user.getPublicUser() });
    } catch (error) {
        res.status(500).json({ error });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserWithCredentials(email, password);
        let userWithToken = user.generateUserWithToken();
        await userWithToken.user.save();
        res.status(200).send(userWithToken);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        const user = req.auth;
        user.accessTokens = user.accessTokens.filter(token => token.token !== req.token);
        await user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error });
    }
})
router.post('/logout/all', auth, async (req, res) => {
    try {
        const user = req.auth;
        user.accessTokens = undefined;
        await user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error });
    }
})

module.exports = router;
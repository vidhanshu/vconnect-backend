const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const userId = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const isAuthenticated = user.accessTokens.some((tk) => {
            return tk.token === token.toString();
        });

        if (!isAuthenticated) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        req.auth = user;
        req.token = token;
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Not authenticated' });
    }
}

module.exports = auth;
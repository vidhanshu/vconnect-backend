const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    accessTokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
});

UserSchema.methods.generateUserWithToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.accessTokens = user.accessTokens.concat({ token });
    return {
        user, token
    }
}

UserSchema.statics.findUserWithCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    return user;
}

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    } else {
        next();
    }
})

UserSchema.methods.getPublicUser = function () {
    try {
        const user = this;
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.accessTokens;
        return userObject;
    } catch (error) {
        throw new Error(error);
    }
}
const User = mongoose.model('User', UserSchema);

module.exports = User;
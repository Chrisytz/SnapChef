const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    // since the token will start with 'Bearer ...'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user from the token (excluding password)
            req.user = await User.findById(decoded.id).select('-password')

            // calls the next piece of middleware
            // the next piece of middleware refers to whatever comes after the 'protect' in
            // router.get('/me', protect, getMe) - in this case there is no more middleware, so it would just run getMe
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('not authorized, no token')
    }
})

module.exports = { protect }
const asyncHandler = require('express-async-handler')

const Goal = require('../models/recipeModel')
const User = require('../models/userModel')

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
    //! req.user is set in authMiddleware
    const goals = await Goal.find({ user: req.user.id}).populate('image_id')
    res.status(200).json(goals)
})

// @desc    Set goals
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
    // req.body is a property of the req object
    if (!req.body.recipe_name || !req.body.ingredients || !req.body.steps) {
        res.status(400)
        throw new Error('please add a recipe name, ingredients or steps field')
    }

    const goal = await Goal.create({
        recipe_name: req.body.recipe_name,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        image_id: req.body.image_id,
        user: req.user.id
    })
    res.status(200).json(goal)
})

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('goal not found')
    }

    // check for user
    if (!req.user) {
        res.status(401)
        throw new Error('user not found')
    }

    // make sure that logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        rew.status(401)
        throw new Error('user not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedGoal)
})

// @desc    Delete goals
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('goal not found')
    }

    // check for user
    if (!req.user) {
        res.status(401)
        throw new Error('user not found')
    }

    // make sure that logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        rew.status(401)
        throw new Error('user not authorized')
    }

    await Goal.findByIdAndDelete(req.params.id)
    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}
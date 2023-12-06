const express = require('express')

const router = express.Router()

// functions from goalController
const {
    getGoals,
    setGoal,
    deleteGoal,
    updateGoal
} = require('../controllers/recipeController')

const {protect} = require('../middleware/authMiddleware')

// the '/' is '/api/goals' because of the app.use('/api/goals', require('./routes/goalRoutes')) inside server.js
// setting up routes
router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal)

module.exports = router
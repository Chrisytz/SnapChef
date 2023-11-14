const express = require('express')
const router = express.Router()
const {
    getGoals,
    setGoal,
    deleteGoal,
    updateGoal
} = require('../controllers/goalController')

const {protect} = require('../middleware/authMiddleware')

// the '/' is '/api/goals' because of the app.use('/api/goals', require('./routes/goalRoutes')) inside server.js
router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal)

module.exports = router
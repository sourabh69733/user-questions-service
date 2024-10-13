const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/create', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:userId/questions/:n?', userController.getQuestionsForUser);
router.post('/store-answer', userController.storeUserAnswer); // New route for storing answers
// Get all answered questions by user
router.get('/answers/:userId', userController.getAllAnswersByUser);

module.exports = router;

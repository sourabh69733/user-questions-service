const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/create', userController.createUser);
router.get('/:id/questions', userController.getQuestionsForUser);
router.get('/:userId/onboarding/:n', userController.getOnboardingQuestions);
router.post('/store-answer', userController.storeUserAnswer); // New route for storing answers

module.exports = router;

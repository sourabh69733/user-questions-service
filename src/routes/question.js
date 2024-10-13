const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question');

router.get('/:type', questionController.getQuestionsByType);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;

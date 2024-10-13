const userDb = require('../models/user');
const questionDb = require('../models/question');
const answerDb = require('../models/answer'); // New answer database model

exports.createUser = (req, res) => {
  const currentTime = parseInt(Date.now() / 1000)

  const user = {
    name: req.body.name,
    gender: req.body.gender,
    createdOn: currentTime,
    updatedOn: currentTime,
  };

  userDb.insert(user, (err, newUser) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json(newUser);
  });
};

exports.getQuestionsForUser = (req, res) => {
  const { id } = req.params;

  userDb.findOne({ _id: id }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const questionType = user.gender === 'female' ? 'daily_women' : 'daily_men';

    // Fetch unanswered questions for the user
    questionDb.find({ type: questionType, answeredBy: { $ne: id } }, (err, questions) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(questions);
    });
  });
};

// Function to fetch n unanswered onboarding questions for male users
exports.getOnboardingQuestions = (req, res) => {
  const { userId, n } = req.params;

  if (!n) n = 7;

  userDb.findOne({ _id: userId }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const questionType = user.gender === 'female' ? 'daily_women' : 'daily_men';

    // Fetch unanswered questions for the user
    questionDb.find({ type: questionType, answeredBy: { $ne: userId } })
              .limit(Number(n))
              .exec((err, questions) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json(questions);
              });
  });
};

// Store user answer and mark question as answered
exports.storeUserAnswer = (req, res) => {
  const { userId, questionId, answer } = req.body;

  // First, check if the user exists
  userDb.findOne({ _id: userId }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Insert the answer into the answers database
    const userAnswer = {
      userId,
      questionId,
      answer,
      createdOn: parseInt(Date.now() / 1000),
    };

    answerDb.insert(userAnswer, (err, newAnswer) => {
      if (err) return res.status(500).json({ message: 'Database error while saving answer' });

      // Mark the question as answered by this user
      questionDb.update({ _id: questionId }, { $push: { answeredBy: userId } }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ message: 'Database error while updating question status' });
        if (numUpdated === 0) return res.status(404).json({ message: 'Question not found' });
        
        res.json({ message: 'Answer stored successfully', answer: newAnswer });
      });
    });
  });
};
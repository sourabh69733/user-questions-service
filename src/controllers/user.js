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

exports.getAllUsers = (req, res) => {
  let { limit, random } = req.query;
  limit = parseInt(limit, 10) || 10; // Default to 0 (no limit)
  random = random === 'true';

  userDb.find({}, (err, users) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    let selectedUsers = users;
    if (random) {
      // Shuffle the users array to get a random sample
      selectedUsers = users.sort(() => 0.5 - Math.random());
      if (limit > 0) {
        selectedUsers = selectedUsers.slice(0, limit); // Apply limit after shuffling
      }
    } else if (limit > 0) {
      selectedUsers = users.slice(0, limit); // Limit without random sampling
    }

    res.json(selectedUsers);
  });
};


exports.getQuestionsForUser = (req, res) => {
  let { userId } = req.params;

  const n = req.params.n ? parseInt(req.params.n) : 1

  userDb.findOne({ _id: userId }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const questionType = user.gender === 'female' ? 'daily_women' : 'daily_men';

    // Fetch unanswered questions for the user
    questionDb.find({ 
      type: questionType, // Include both genders and the user's gender
      'answeredBy': { $ne: { $elemMatch: { userId: userId } } } // Not answered by the user
    }, (err, questions) => {
      if (err) {
        console.error('Error fetching questions:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      // Randomly sample 7 questions from the results
      const sampledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, n);
      res.json(sampledQuestions);
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

exports.getAllAnswersByUser = (req, res) => {
  const userId = req.params.userId;

  // Step 1: Fetch answers for the user
  answerDb.find({ userId: userId }, (err, answers) => {
    if (err) {
      console.error('Error fetching answers:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Step 2: Extract question IDs from the answers
    const answeredQuestionIds = answers.map(answer => answer.questionId);

    questionDb.find({ 
      _id: { $in: answeredQuestionIds } 
    }, (err, questions) => {
      if (err) {
        console.error('Error fetching questions:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const finalResponse = []
      questions.forEach((question) => {
        const ans = answers.find((item) => item.questionId == question._id)
        finalResponse.push({
          question,
          answer: ans.answer,
        })
      })
      res.json(finalResponse);
    });
  });
};
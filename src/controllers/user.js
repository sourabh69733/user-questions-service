const userDb = require('../models/user');
const questionDb = require('../models/question');

exports.createUser = (req, res) => {
  const user = {
    name: req.body.name,
    gender: req.body.gender,
  };

  userDb.insert(user, (err, newUser) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json(newUser);
  });
};

exports.getQuestionsForUser = (req, res) => {
  userDb.findOne({ _id: req.params.id }, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const questionType = user.gender === 'female' ? 'daily_women' : 'daily_men';

    questionDb.find({ type: questionType }, (err, questions) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(questions);
    });
  });
};

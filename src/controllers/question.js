const questionDb = require('../models/question');

exports.getQuestionsByType = (req, res) => {
  questionDb.find({ type: req.params.type }, (err, questions) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(questions);
  });
};

exports.createQuestion = (req, res) => {
  const question = {
    type: req.body.type,
    text: req.body.text,
    video_url: req.body.video_url,
  };

  questionDb.insert(question, (err, newQuestion) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json(newQuestion);
  });
};

exports.updateQuestion = (req, res) => {
  const { id } = req.params;
  const updatedData = { text: req.body.text, video_url: req.body.video_url };

  questionDb.update({ _id: id }, { $set: updatedData }, {}, (err, numReplaced) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (numReplaced === 0) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question updated' });
  });
};

exports.deleteQuestion = (req, res) => {
  questionDb.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (numRemoved === 0) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  });
};

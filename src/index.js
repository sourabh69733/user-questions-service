const express = require('express');
const questionRoutes = require('./routes/question');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded( { extended: true }));

app.use('/questions', questionRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

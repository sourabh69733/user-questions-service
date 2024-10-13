const axios = require('axios');

const apiUrl = 'http://localhost:3000'; // Update this to your server's URL

// Function to add users
async function addUser(name, gender) {
    const response = await axios.post(`${apiUrl}/users/create`, { name, gender });
    console.log(`Added User: ${response.data.name}, Gender: ${response.data.gender}`);
    return response.data;
}

// Function to add questions
async function addQuestion(type, text, videoUrl) {
    const response = await axios.post(`${apiUrl}/questions/create`, { type, text, videoUrl });
    return response.data;
}

// Function to store answer
async function storeAnswer(userId, questionId, answer) {
    const response = await axios.post(`${apiUrl}/users/store-answer`, { userId, questionId, answer });
    return response.data;
}

// Main function to execute the script
(async () => {
    try {
        // Step 1: Add Users
        const maleUser = await addUser('John Doe', 'male');
        const femaleUser = await addUser('Jane Smith', 'female');

        // Step 2: Add Questions
        const questions = [
            // Male Questions
            { type: 'daily_men', text: 'What is your favorite outdoor activity?', videoUrl: '' },
            { type: 'daily_men', text: 'How often do you exercise?', videoUrl: '' },
            { type: 'daily_men', text: 'What sports do you enjoy?', videoUrl: '' },
            { type: 'daily_men', text: 'Do you prefer team sports or individual sports?', videoUrl: '' },
            { type: 'daily_men', text: 'What is your dream vacation destination?', videoUrl: '' },
            { type: 'daily_men', text: 'What is your favorite book?', videoUrl: '' },
            { type: 'daily_men', text: 'How do you usually spend your weekends?', videoUrl: '' },

            // Female Questions
            { type: 'daily_women', text: 'What is your favorite hobby?', videoUrl: '' },
            { type: 'daily_women', text: 'What is your favorite type of music?', videoUrl: '' },
            { type: 'daily_women', text: 'How do you relax after a long day?', videoUrl: '' },
            { type: 'daily_women', text: 'What is your favorite movie?', videoUrl: '' },
            { type: 'daily_women', text: 'What is your favorite cuisine?', videoUrl: '' },
            { type: 'daily_women', text: 'What are your career aspirations?', videoUrl: '' },
            { type: 'daily_women', text: 'How important is family to you?', videoUrl: '' },
        ];

        const addedQuestions = [];
        for (const question of questions) {
            const addedQuestion = await addQuestion(question.type, question.text, question.videoUrl);
            addedQuestions.push(addedQuestion);
        }

        // Step 3: Store Answers
        const maleAnswers = [
            'I enjoy hiking the most.',
            'I exercise at least 3 times a week.',
            'I love soccer and basketball.',
            'I prefer team sports.',
            'I want to visit Japan.',
            'My favorite book is "1984".',
            'I usually spend my weekends relaxing at home.'
        ];

        const femaleAnswers = [
            'I love painting and reading.',
            'I enjoy pop music.',
            'I like to take long baths and read.',
            'My favorite movie is "Pride and Prejudice".',
            'I love Italian food.',
            'I aspire to be a graphic designer.',
            'Family is very important to me.'
        ];

        const data = []

        for (let i = 0; i < maleAnswers.length; i++) {
            await storeAnswer(maleUser._id, addedQuestions[i]._id, maleAnswers[i]);
            data.push({ user: maleUser.name, question: addedQuestions[i].text, answer: maleAnswers[i]})
        }

        for (let i = 0; i < femaleAnswers.length; i++) {
            await storeAnswer(femaleUser._id, addedQuestions[maleAnswers.length + i]._id, femaleAnswers[i]);
            data.push({ user: femaleUser.name, question: addedQuestions[maleAnswers.length + i].text, answer: femaleAnswers[i]})
        }

        console.table(data)

        console.log('All operations completed successfully.');
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
    }
})();

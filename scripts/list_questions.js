const axios = require('axios');
const readline = require('readline');

const apiUrl = 'http://localhost:3000'; // Update this to your server's URL

// Function to get all users
async function getAllUsers() {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    return [];
  }
}

// Function to get onboarding questions for a male user
async function getOnboardingQuestions(userId, n = 7) {
  try {
    const response = await axios.get(`${apiUrl}/users/${userId}/onboarding/${n}`);
    console.log(`\nOnboarding Questions for User ID ${userId} (n=${n}):`);
    console.table(response.data.map((question, index) => ({
      No: index + 1,
      Question: question.text,
    })));
  } catch (error) {
    console.error('Error fetching onboarding questions:', error.response ? error.response.data : error.message);
  }
}

// Function to get random unanswered questions for a user based on their gender
async function getQuestionsForUser(userId) {
  try {
    const response = await axios.get(`${apiUrl}/users/${userId}/questions`);
    console.log(`\nUnanswered Questions for User ID ${userId}:`);
    console.table(response.data.map((question, index) => ({
      No: index + 1,
      Question: question.text,
    })));
  } catch (error) {
    console.error('Error fetching questions for user:', error.response ? error.response.data : error.message);
  }
}

async function getAnswersByUser(userId) {
  try {
    const response = await axios.get(`${apiUrl}/users/answers/${userId}`);
    console.log(`\nAnswered Questions for User ID ${userId}:`);
    console.table(response.data.map(({ question, answer }, index) => ({
      No: index + 1,
      Question: question.text,
      Answer: answer
    })));
  } catch (error) {
    console.error('Error fetching questions for user:', error.response ? error.response.data : error.message);
  }
}

// Prompt user to choose from list of users and run the script
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  const users = await getAllUsers();

  if (users.length === 0) {
    console.log('No users available.');
    rl.close();
    return;
  }

  console.log('\nAvailable Users:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (ID: ${user._id}, Gender: ${user.gender})`);
  });

  rl.question('\nChoose a user by number: ', async (choice) => {
    const selectedIndex = parseInt(choice) - 1;

    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
      console.log('Invalid choice. Please run the script again.');
      rl.close();
      return;
    }

    const selectedUser = users[selectedIndex];
    const userId = selectedUser._id;

    // Fetch unanswered questions based on the selected user's gender
    await getQuestionsForUser(userId);

    await getAnswersByUser(userId);

    rl.close();
  });
})();

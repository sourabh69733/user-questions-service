# User questions and answer service

## Introduction

The primary components include users, questions, and answers, and the interactions occur through a RESTful API.

## Workflow Steps

### 1. User Creation

- **Action**: A new user (either male or female) is created by sending a POST request to the `/users/create` API route.
- **Input**: The request includes a `User Object`, which contains user details such as name and gender.
- **Process**:
  - The server validates the input data.
  - If valid, the user is stored in the NeDB database.
  - A success message is returned to the client.

### 2. Question Creation

- **Action**: Administrators or authorized users can create new questions by sending a POST request to the `/questions/create` API route.
- **Input**: The request includes a `Question Object`, containing the text of the question and its gender specification.
- **Process**:
  - The server validates the question data.
  - If valid, the question is saved to the database.
  - A success message is returned to the client.

### 3. Fetching Questions for Users

- **Action**: When a user logs in or during onboarding, a request is made to retrieve questions tailored to their gender by sending a GET request to `/users/:userId/questions/:n?`.
- **Input**: The request includes the `userId` as a path parameter and an optional `n` parameter indicating the number of questions to return (defaults to 7).
- **Process**:
  - The server retrieves all unanswered questions matching the user's gender from the database.
  - A random selection of questions is sent back to the client.

### 4. Storing User Answers

- **Action**: When a user answers a question, a POST request is sent to the `/users/store-answer` API route.
- **Input**: The request contains an `Answer Object`, which includes the `userId` and `questionId`.
- **Process**:
  - The server validates the answer data.
  - The answer is saved to the database under the answers collection, marking the question as answered for the user.
  - A success message is returned to the client.

### 5. Retrieving User Answers

- **Action**: Users can review their answered questions by sending a GET request to the `/users/answers/:userId` route.
- **Input**: The request includes the `userId` as a path parameter.
- **Process**:
  - The server fetches all questions that the user has answered from the database.
  - The results are sent back to the client for display.

### 6. Listing All Users and Questions

- **Action**: Administrators or authorized users can retrieve lists of all users and all questions.
- **Endpoints**:
  - To fetch all users: GET `/users`
  - To fetch all questions: GET `/questions`
- **Process**:
  - The server retrieves the respective data from the database and returns it in the response.


## 1. Architecture and Layers

This project follows a modular architecture that separates concerns into distinct layers:

- **Controllers**: Handle incoming requests, process data using services or models, and return responses.
- **Models**: Define the database schemas and provide methods for database interactions.
- **Routes**: Define API endpoints and map them to the corresponding controller functions.
- **Database**: NeDB is used as the lightweight database for storing users, questions, and answers.
- **Server**: An Express.js server handles HTTP requests and responses.


## 2. Installation and Running Steps

### Prerequisites

- Node.js (>= 14.x)
- npm (Node Package Manager)
- yarn

### Steps

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:sourabh69733/user-questions-service.git
   cd user-questions-service
2. **Install packages**
```bash
yarn
```
3. **Start server**
```bash
yarn start
```

## 3. API Endpoints
- We can run js script to add sample users, questions and their answers also by users. It will add and print the output in table. So you can verify data is added properly.
```bash
node ./scripts/add_user_ques_ans.js
```
- We can list all unanswered and answered questions by a particular user also. We can select user by cli prompt and based on selected user, it will show us all questions and answers.
```bash
node ./scripts/list_ques_ans.js
```

## 3. API Endpoints

Below is a list of all API endpoints, including input and output schemas.

| Method | API Route                        | Parameters                       | Request Body                | Description                                                  |
|--------|----------------------------------|----------------------------------|-----------------------------|--------------------------------------------------------------|
| GET    | `questions/:type`                | `type` (string: "daily_female" or "daily_male") | None                        | Retrieves questions based on a specified type.              |
| POST   | `questions/create`               | None                             | `Question Object` (see below) | Creates a new question.                                      |
| POST   | `users/create`                   | None                             | `User Object` (see below)     | Creates a new user.                                         |
| GET    | `users/`                         | None                             | None                        | Retrieves all users.                                         |
| GET    | `users/:userId/questions/:n?`    | `userId` (path param), `n` (optional, Number) | None                        | Retrieves questions for a specific user. Optional `n` limits the number of questions (defaults to 7). |
| POST   | `users/store-answer`             | None                             | `Response Answer Object` (see below)  | Stores a user's answer to a question.                        |
| GET    | `users/answers/:userId`          | `userId` (path param)           | None                        | Retrieves all answered questions by a specific user.        |


**Notes:**

* The `:n?` in the user questions route indicates an optional parameter.
* Question Object: 
```schema
    type: string
    text: string
    video_url: string
    createdOn: int
    updatedOn: int
```
* Response Answer Object:
```schema
      userId: int
      questionId: int
      answer: string
      createdOn: int
```
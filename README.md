# User questions and answer service

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
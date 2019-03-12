# the source news

A RESTful news API.

Read articles, browse topics, comment and vote on the latest news

Available actions include:

- Topics: get all topics, add a topic
- Articles: post an article in a topic, get all articles for a topic, get all articles
- Single article: get, vote on, or delete an article
- Comments: get all comments for an article; post, vote on or delete a comment
- Users: get all users, add a user
- All endpoints that serve articles or comments are queriable, allowing chages to sort order, sort criterion, and pagination

See https://the-source-news.herokuapp.com/api for a detailed list of endpoints and how to interact with them.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### To run the project locally:

- Clone the repo and run the command `npm install`. This will install all the necessary dependencies.
- See `package.json` for a list of other commands available, including database migrations and seeding, development mode, and testing.

## Running the tests

To run the tests, use the command `npm test`. This will set up a test database on your machine and run the `spec` folder using test data.

## Deployed Version and Links

View a deployed version of the API here: https://the-source-news.herokuapp.com/api

the source news also has a responsive frontend built with ReactJS.

Frontend on Github: https://github.com/craigweighman/the-source-news-frontend

Frontend deployed version: https://the-source-news.netlify.com/

## Built by

Craig Weighman - github.com/craigweighman

## Acknowledgments

This project was completed as part of the Northcoders Developer Pathway. Thanks to the tutors at Northcoders for their support and feedback throughout

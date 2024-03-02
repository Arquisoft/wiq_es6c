const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-stats-service'); 

  await Game.create([
    { id: 1, username: 'user1', points: 100, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [1,1] }] },
    { id: 2, username: 'user2', points: 0, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [0,1] }] }
  ]);

});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Stats Service', () => {
  it('should add a new game on POST /addgame', async () => {
    const newGame = {
      id: 1,
      username: 'testuser',
      points: 100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }, {
        title: 'Question 2',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 1]
      }]
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', newGame.id);
    expect(response.body).toHaveProperty('username', newGame.username);
    expect(response.body).toHaveProperty('points', newGame.points);
    expect(response.body.questions).toHaveLength(newGame.questions.length);

    // Iterate through each question in the response and match with newGame
    response.body.questions.forEach((question, index) => {
      expect(question).toHaveProperty('title', newGame.questions[index].title);
      expect(question.answers).toEqual(newGame.questions[index].answers);
      expect(question).toHaveProperty('ansIndex', newGame.questions[index].ansIndex);
    });
  });

  it('should get a game by username on GET /getgame', async () => {
    const username = 'user1';
    const response = await request(app).get(`/getgame?username=${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('username', username);
    expect(response.body).toHaveProperty('points', 100);
    expect(response.body.questions).toHaveLength(1);
  });

  it('should return 404 if user does not exist on GET /getgame', async () => {
    const username = 'nonexistentuser';
    const response = await request(app).get(`/getgame?username=${username}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found!');
  });

});


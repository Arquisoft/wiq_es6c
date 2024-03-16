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

describe('User Stats Service, fields are wrong in post(/addgame) method', () => {

  // Case 1: All fields are missing
  it('should return 400 if required fields are missing on POST /addgame', async () => {
    const response = await request(app).post('/addgame').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required fields: id, points, username, questions');
  });

  // Case 2: Field id is missing
  it('should return 400 if id field is missing on POST /addgame', async () => {
    const newGame = {
      username: 'testuser',
      points: 100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: id');
  });

  // Case 3: Field points is missing
  it('should return 400 if points field is missing on POST /addgame', async () => {
    const newGame = {
      id: 1,
      username: 'testuser',
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: points');
  });

  // Case 4: Filed username is missing
  it('should return 400 if username field is missing on POST /addgame', async () => {
    const newGame = {
      id: 1,
      points: 100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: username');
  });

  // Case 5: Field questions is missing
  it('should return 400 if questions field is missing on POST /addgame', async () => {
    const newGame = {
      id: 1,
      username: 'testuser',
      points: 100,
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: questions');
  });

  // Case 6: Some fields are missing
  it('should return 400 if some required fields are empty on POST /addgame', async () => {
    const newGame = {
      id: '',
      username: '',
      points: '',
      questions: [],
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Required fields cannot be empty');
  });

  // Case 7: All fields are nulls
  it('should return 400 if all required fields are null on POST /addgame', async () => {
    const newGame = {
      id: null,
      username: null,
      points: null,
      questions: null,
    };

    const response = await request(app).post('/addgame').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Required fields cannot be null');
  });
});


describe('User Stats Service correct data is inserted', () => {
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


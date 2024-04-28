const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Game = require('./game-stats-model');
const User = require('./user-stats-model');

let mongoServer;
let app;

async function addGame(game){
  
  const newGame = new Game({
    id: game.id,
    username: game.username,
    avgtime: game.avgtime,
    points: game.points,
    questions: game.questions,
  });

  await newGame.save();
}

async function addUser(user) {
  const newUser = new User({
      username: user.username,
      tpoints: user.tpoints,
      ttime: user.ttime,
      ngames: user.ngames,
      createdAt: new Date(),
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-stats-service'); 

  await addGame({ id: 1, username: 'user1', points: 100, avgtime:100, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [1,1] }] });
  await addGame({ id: 2, username: 'user1', points: 0, avgtime:100, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3'], ansIndex: [0,1] }] });
  await addUser({ username: 'user1', tpoints: 100, ttime: 10, ngames: 1 });
});

afterAll(async () => {
  await Game.deleteMany({});
  await User.deleteMany({});
  app.close();
  await mongoServer.stop();
});

describe('User Stats Service, fields are wrong in post(/game) method', () => {

  // Case 1: All fields are missing
  it('should return 400 if required fields are missing on POST /game', async () => {
    const response = await request(app).post('/history/game').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: id');
  });

  // Case 2: Field id is missing
  it('should return 400 if id field is missing on POST /game', async () => {
    const newGame = {
      username: 'testuser',
      points: 100,
      avgtime: 100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: id');
  });

  // Case 3: Field points is missing
  it('should return 400 if points field is missing on POST /game', async () => {
    const newGame = {
      id: 1,
      username: 'testuser',
      avgtime:100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: points');
  });

  // Case 4: Filed username is missing
  it('should return 400 if username field is missing on POST /game', async () => {
    const newGame = {
      id: 1,
      points: 100,
      avgtime:100,
      questions: [{
        title: 'Question 1',
        answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
        ansIndex: [1, 2]
      }]
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: username');
  });

  // Case 5: Field questions is missing
  it('should return 400 if questions field is missing on POST /game', async () => {
    const newGame = {
      id: 1,
      username: 'testuser',
      points: 100,
      avgtime:100,
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: questions');
  });

    // Case 6: Field avgtime is missing
    it('should return 400 if avgtime field is missing on POST /game', async () => {
      const newGame = {
        id: 1,
        username: 'testuser',
        points: 100,
        questions: [{
          title: 'Question 1',
          answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
          ansIndex: [1, 2]
        }]
      };
  
      const response = await request(app).post('/history/game').send(newGame);
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required field: avgtime');
    });

  // Case 7: Some fields are missing
  it('should return 400 if some required fields are empty on POST /game', async () => {
    const newGame = {
      id: '',
      username: '',
      points: '',
      avgtime: '',
      questions: [],
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: id');
  });

  // Case 8: All fields are nulls
  it('should return 400 if all required fields are null on POST /game', async () => {
    const newGame = {
      id: null,
      username: null,
      points: null,
      avgtime: null,
      questions: null,
    };

    const response = await request(app).post('/history/game').send(newGame);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Missing required field: id');
  });
});


describe('User Stats Service correct data is inserted', () => {
  it('should add a new game on POST /game', async () => {
    const newGame = {
      id: "1",
      username: 'testuser',
      points: 100,
      avgtime: 100,
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

    const response = await request(app).post('/history/game').send(newGame);

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

  it('should get a game by username on GET /games with limit=1', async () => {
    const username = 'user1';
    const response = await request(app).get(`/history/games/${username}?limit=1`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('id', "1");
    expect(response.body[0]).toHaveProperty('username', username);
    expect(response.body[0]).toHaveProperty('points', 100);
  });

  it('should return 404 if user does not exist on GET /games with limit=1', async () => {
    const username = 'nonexistentuser';
    const response = await request(app).get(`/history/games/${username}?limit=1`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found!');
  });

  it('should get a game by username on GET /games', async () => {
    const username = 'user1';
    const response = await request(app).get(`/history/games/${username}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should return 404 if user does not exist on GET /games', async () => {
    const username = 'nonexistentuser';
    const response = await request(app).get(`/history/games/${username}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found!');
  });

});

describe('User Stats Service get all users', () => {
  it('should return all users on GET /history/users', async () => {
      const response = await request(app).get('/history/users');
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2); 
      expect(response.body[0]).toHaveProperty('username', 'user1');
      expect(response.body[0]).toHaveProperty('tpoints', 100);
      expect(response.body[0]).toHaveProperty('ttime', 10);
      expect(response.body[0]).toHaveProperty('ngames', 1);
      expect(response.body[0]).toHaveProperty('createdAt'); 
  });

  it('should return 500 if an error occurs during database query', async () => {
     
      jest.spyOn(User, 'find').mockImplementationOnce(() => { throw new Error('Database error'); });

      const response = await request(app).get('/history/users');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Database error');
  });
});



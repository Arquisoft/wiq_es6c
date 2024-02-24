const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./store-q-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Store questions service', () => {
  it('should add a new question on POST /addquestion', async () => {
    const newQuestion = {
      question: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      answers: ['Segovia','León','Valladolid','Ninguna'],
    };

    const response = await request(app).post('/addquestion').send(newQuestion);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('question', 'answers');
  });
});

describe('Store questions service', () => {
  it('should get all questions on GET /questions', async () => {
    const newQuestion1 = {
      question: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      answers: ['Segovia','León','Valladolid','Ninguna'],
    };
    const newQuestion2 = {
      question: '¿Cuál es la capital Italia?',
      answers: ['Roma','Nápoles','Florencia','Milán'],
    };
    const newQuestion3 = {
      question: '¿Cuál es el país mas poblado de la tierra?',
      answers: ['China','Estados Unidos','Brazil','India'],
    };

    request(app).post('/addquestion').send(newQuestion1);
    request(app).post('/addquestion').send(newQuestion2);
    request(app).post('/addquestion').send(newQuestion3);

    const response = await request(app).get('/questions');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([newQuestion1, newQuestion2, newQuestion3])
    );
  });
});


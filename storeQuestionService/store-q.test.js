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
  it('should add a new question on POST /history/question', async () => {
    const newQuestion = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia','León','Valladolid'],
      createdAt: '<2002-02-02>'
    };

    const response = await request(app).post('/history/question').send(newQuestion);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pregunta', 'respuesta_correcta', 'respuestas_incorrectas');
  });
});

describe('Store questions service', () => {
  it('should get all questions on GET /history/questions', async () => {
    const newQuestion1 = {
      pregunta: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
      respuesta_correcta: 'Ninguna',
      respuestas_incorrectas: ['Segovia','León','Valladolid'],
      createdAt: '<2002-02-02>'
    };
    const newQuestion2 = {
      pregunta: '¿Cuál es la capital Italia?',
      respuesta_correcta: 'Roma',
      respuestas_incorrectas: ['Nápoles','Florencia','Milán'],
      createdAt: '<2002-02-02>'
    };
    const newQuestion3 = {
      pregunta: '¿Cuál es el país mas poblado de la tierra?',
      respuesta_correcta: 'India',
      respuestas_incorrectas: ['China','Estados Unidos','Brazil'],
      createdAt: '<2002-02-02>'
    };
  
    request(app).post('/history/question').send(newQuestion1);
    request(app).post('/history/question').send(newQuestion2);
    request(app).post('/history/question').send(newQuestion3);

    const response = await request(app).get('/history/questions');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([newQuestion1, newQuestion2, newQuestion3])
    );
  });
});

